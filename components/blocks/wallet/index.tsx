import React, { Children, FC } from 'react';
import { Box } from 'rebass';
import Header, { HeaderProps } from './header';
import LogoButton, { LogoButtonProps } from './logo-button';
import SubHeader, { SubHeaderProps } from './sub-header';

interface Wallet {
  Header: React.FC<HeaderProps>;
  SubHeader: React.FC<SubHeaderProps>;
  LogoButton: React.FC<LogoButtonProps>;
}

export interface WalletProps {
  children: any;
}

const Wallet: FC<WalletProps> & Wallet = ({ children }) => {
  return (
    <Box>
      {Children.map(children, (child: any) => {
        if (child.type.name === 'Header') {
          return React.cloneElement(child, child.props);
        }

        if (child.type.name === 'SubHeader') {
          return React.cloneElement(child, child.props);
        }

        if (child.type.name === 'LogoButton') {
          return React.cloneElement(child, child.props);
        }

        return child;
      })}
    </Box>
  );
};

Wallet.Header = Header;
Wallet.SubHeader = SubHeader;
Wallet.LogoButton = LogoButton;

export default Wallet;
