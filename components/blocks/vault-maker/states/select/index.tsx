import React, { useState } from 'react';import { Flex, Text } from 'rebass';
import { Container } from '@backtothecode/vm-ui-library';
import { SWAP_NUM, LOCK_NUM } from '../../../../../constants/step-names';
import { addBalancesToTokens, getAccount, getTokens, selectTokenWithLargestBalance } from '../../../../../utils/maker';
import { initMaker } from '../../../../../utils/maker/init-maker';
import { Button } from '../../../../elements/button/regular';
import { Loading } from '../../../../elements/loading';
import { Title } from '../../../../elements/title';
import styles from './styles';

/**
 * SelectProps {@link Select}
 * @see Select
 */

export interface SelectProps {
  /**
   * A system-ui style object
   */
  sx?: any;
}

/**
 * Select step of Wizard
 *
 * @components
 * @example
 * return (
 *   <Select  />
 * )
 *
 * @see SelectProps
 * @extends {FC<Props>}
 */
export const Select = props => {
  const { balance, balanceTitle, balanceToken, balanceUsd, button, buttonContainer, container, subTitle, swap, title } = styles;
  const { symbol, sx } = props;

  /**
   * Select method that initialises web3 and maker objects
   *
   * An instantiated maker object
   * @typedef {Object} Maker
   * 
   * @return {Maker}
   */

  /**
   * Click handler for when users attempt to connect with Metamask
   * Triggers loading component and updates global state
   *
   * An instantiated maker object   
   * @typedef {Object} evt      Synthetic React event
   * 
   */

  return (
    <Flex sx={{...container, ...sx }}>
      <Title sx={title}>Select a token</Title>
      <Text sx={{...title, ...subTitle}} variant="body.regular">Decide what tokens you would like to use as collateral for your Vault</Text>
      <Container data-testid="first-vault" sx={{ ...balance, ...sx }}>
        <Text sx={balanceTitle} variant="body.regular">Balance</Text>
        <Title sx={balanceToken}>{`101.35 ${symbol}`}</Title>
        <Text sx={balanceUsd} variant="body.regular">5,024.24 USD</Text>
      </Container>
      <Container sx={buttonContainer}>
         <Button sx={button}>Select</Button>
         <Text sx={swap} variant="body.regular">Swap collateral</Text>
      </Container>   
    </Flex>
  );
};

Select.defaultProps = {
  symbol: 'ETH'
}