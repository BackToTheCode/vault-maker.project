import connect from '../../../../../store/connect';
import { Select } from '../select';

function mapStateToProps(state: any) {
  const { isTransitioning } = state.routing;

  return {
    isTransitioning
  };
}

// function mapDispatchToProps(dispatch: any) {
//   return {
//     dispatchConnect: (payload: any) => dispatch({ type: 'CONNECT', payload}),
//     dispatchSelectToken: (payload: any) => dispatch({ type: 'SELECT_TOKEN', payload }),
//     dispatchSetMaker: (payload: any) => dispatch({ type: 'SET_MAKER', payload}),
//     dispatchSetWeb3: (payload: any) => dispatch({ type: 'SET_WEB3', payload}),
//     dispatchStep: (payload: any) => dispatch({ type: 'STEP', payload }),
//     dispatchTokens: (payload: any) => dispatch({ type: 'SELECT_TOKEN' , payload}),
//   };
// }

const WrappedSelect = connect(mapStateToProps, null)(Select);

export { WrappedSelect };