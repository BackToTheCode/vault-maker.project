import React from 'react';
import { Box } from 'rebass';
import steps, { CONNECT, SELECT } from '../../../../constants/step-names';
import { WrappedConnect } from '../states/connect/wrapper';
import { WrappedSelect } from '../states/select/wrapper';
import styles from './styles';

/**
 * VaultMakerProps {@link Wizard}
 * @see Wizard
 */

export interface WizardProps {
  /**
   * Whether a route transition is in progress
   */
  sx?: any;
}

/**
 * Vault Maker Wizard
 *
 * @component
 * @example
 * return (
 *   <Wizard  />
 * )
 *
 * @see WizardProps
 * @extends {FC<Props>}
 */
export const Wizard = props => {
  const { isTransitioning, sx, step } = props;
  const { base, transitioning } = styles;

  return (
    <Box sx={{...base, ...(transitioning(isTransitioning)), ...sx}}>
      {step === steps[CONNECT] && <WrappedConnect />} 
      {step === steps[SELECT] && <WrappedSelect />} 
    </Box>
  );
};
