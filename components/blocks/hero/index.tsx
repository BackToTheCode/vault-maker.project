/** @jsx jsx */
import { FullContainer, Loading } from '@backtothecode/vault-maker-ui';
import { jsx } from '@emotion/core';
import uniqBy from 'lodash.uniqby';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import ledgerLogo from '../../../public/images/ledger-logo.png';
import metamaskLogo from '../../../public/images/metamask-fox.svg';
import trezorLogo from '../../../public/images/trezor-logo.png';
import {
  BAT,
  ETH,
  getWeb3 as mkrGetWeb3,
  MDAI,
  setup as mkrSetup
} from '../../../utils/web3';
import { VaultMaker } from '../vault-maker/wrapped';
import { Wallet } from '../wallet';

export interface HeroProps {
  drawAmount: number;
  lockAmount: number;
  variant?: string;
  isComplete: boolean;
  isConnected: boolean;
  isCreated: boolean;
  children?: React.ReactNode;
  dispatchConnect: ({ address }: { address: string }) => void;
  dispatchTokens: ({ tokens }: { tokens: any[] }) => void;
  dispatchSelectToken: ({ selectedToken }: { selectedToken: any }) => any;
  dispatchSetMaker: ({ maker }: { maker: any }) => any;
  dispatchSetWeb3: ({ web3 }: { web3: any }) => any;
  maker: any;
  selectedToken: any;
  web3: any;
}

interface Hero {
  Wrapped?: any;
}

export const Hero: FC<HeroProps> & Hero = props => {
  const [isLoading, setLoading] = useState(false);
  let { maker, web3 } = props;
  const {
    isConnected,
    isComplete,
    isCreated,
    selectedToken
  } = props;
  const router = useRouter();

  const addBalances = async (tokens: any[]) => {
    if (!maker) {
      return;
    }
    const tokenService = maker.service('token');

    const clonedTokens: any[] = tokens.map((token: any) => token);
    for (const [idx, token] of tokens.entries()[Symbol.iterator]()) {
      const tokenFromService = tokenService.getToken(token.symbol);
      const tokenBalance = await tokenFromService.balance();
      clonedTokens[idx].balance = tokenBalance.toNumber();
      clonedTokens[idx].usdValue = tokenBalance.toNumber() * token.price;
    }

    return clonedTokens;
  };

  const getTokens = async () => {
    if (!maker) {
      return;
    }
    const { cdpTypes } = maker.service('mcd:cdpType');
    const uniqCdpTypes = uniqBy(cdpTypes, (cdpt: any) => cdpt.currency.symbol);

    console.log('uniqCdpTypes', uniqCdpTypes);
    const dict: object = {};
    const tokens = uniqCdpTypes.map((cdpType: any) => {
      console.log('cdpType', cdpType);
      const token = {
        ilk: cdpType.ilk,
        penalty: cdpType.liquidationPenalty,
        price: cdpType.price.toBigNumber().toNumber(),
        ratio: cdpType.liquidationRatio.toBigNumber().toNumber(),
        symbol: cdpType.currency.symbol
      };
      return { ...token, ...dict[token.symbol] };
    });

    return tokens;
  };

  const getAccount = async () => {
    if (!web3) {
      return;
    }
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    return userAccount;
  };

  const selectDefaultToken = (tokens: any[]) => {
    if (!tokens) {
      return;
    }
    const usdValues = tokens.map(token => parseInt(token.usdValue, 10));
    const maxIndex = usdValues.indexOf(Math.max(...usdValues));
    return tokens[maxIndex];
  };

  const setupMaker = async () => {
    const network = process.env.NETWORK || 'kovan';
    const provider = process.env.PROVIDER || 'browser';
    const url = process.env.URL;
    const privateKey = process.env.PRIVATE_KEY;

    maker = await mkrSetup(network, provider, { url, privateKey });
    web3 = (await mkrGetWeb3()) as any;

    console.log('localMaker', maker);

    props.dispatchSetMaker({ maker });
    props.dispatchSetWeb3({ web3 });

  };

  const handleMetamask = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() =>{
      setLoading(false);
    }, 4000);

    try {
      await setupMaker();
      if (maker) {
        const userAccount = await getAccount();
        const tokens = await getTokens();
        const tokensWithBalances = await addBalances(tokens);
        const newSelectedToken = selectDefaultToken(tokensWithBalances);

        props.dispatchConnect({ address: userAccount });
        props.dispatchTokens({ tokens: tokensWithBalances });
        props.dispatchSelectToken({ selectedToken: newSelectedToken });

        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { ilk, symbol } = selectedToken;
  const { drawAmount, lockAmount } = props;

  const vaultOptions = {
    drawAmount,
    ilk,
    lockAmount,
    symbol
  };

  return (
    <FullContainer variant="container.default">
      {renderWallet(isConnected, isLoading, handleMetamask)}
      {renderVaultMaker(isComplete, isConnected)}
      {renderDashboard(isComplete, isCreated, router, maker, vaultOptions)}
    </FullContainer>
  );
};

const renderDashboard = (
  isComplete: boolean,
  isCreated: boolean,
  router: any,
  maker: any,
  vaultOptions: any
) => {

  const { ilk, symbol, lockAmount, drawAmount } = vaultOptions;

  const tokens = {
    BAT,
    ETH
  };

  const createCdp = async () => {
    const cdpManager = maker.service('mcd:cdpManager');
    const TOK = tokens[symbol];

    const cdp = await cdpManager.openLockAndDraw(
      ilk,
      TOK(lockAmount),
      MDAI(drawAmount)
    ).catch(error => {
      console.error(`bad error ${error}`);
    });
    if (cdp) {
      console.log('cdp', cdp);
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    if (isComplete) {
      createCdp();
    }
  }, [isComplete]);

  return (
    isComplete && !isCreated && <Loading text={'Creating your new Vault...'} />
  );
};

const renderWallet = (
  isConnected: boolean,
  isLoading: boolean,
  handleMetamask: (e: any) => Promise<void>
) =>
  !isConnected &&
  (isLoading ? (
    <Loading />
  ) : (
    <Wallet>
      <Wallet.Header>Start Making a Vault</Wallet.Header>
      <Wallet.SubHeader>Connect to the Ethereum network</Wallet.SubHeader>
      <Wallet.LogoButton
        variant="outline"
        icon={metamaskLogo}
        onClick={handleMetamask}
      >
        Connect with Metamask
      </Wallet.LogoButton>
      <Wallet.LogoButton variant="outline" icon={trezorLogo} isDisabled={true}>
        Trezor - coming soon...
      </Wallet.LogoButton>
      <Wallet.LogoButton variant="outline" icon={ledgerLogo} isDisabled={true}>
        Ledger - coming soon...
      </Wallet.LogoButton>
    </Wallet>
  ));

const renderVaultMaker = (isComplete: boolean, isConnected: boolean) => {
  return !isComplete && isConnected && <VaultMaker.Wrapped />;
};

// const VaultMaker: any = dynamic(() => import('../vault-maker/wrapped').then(mod => mod.VaultMaker),
//   {
//     loading: () => <Loading />
//   }
// );
// // console.log('DynamicVaultMaker', DynamicVaultMaker);
// // return isConnected && <DynamicVault />
