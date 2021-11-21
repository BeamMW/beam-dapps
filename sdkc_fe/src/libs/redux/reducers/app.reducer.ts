import { TxItem } from '@types';
import { ActionCreators } from '../action-creators/action-creators';
import { ACTIONS } from '../constants';

interface IApp {
  cid: string
  pKey: string | null,
  loading: boolean,
  txs: Set<TxItem>
  error: {
    code: number,
    status: string,
    message: string
  } | null
}

const initialState:IApp = {
  cid: '',
  loading: true,
  error: null,
  pKey: null,
  txs: new Set()
};

const reducer = (
  state:IApp = initialState, action: ActionCreators
):IApp => {
  const newState = {
    ...state,
    txs: new Set(state.txs),
    error: state.error ? { ...state.error } : null
  };
  switch (action.type) {
    case ACTIONS.SET_CID: {
      newState.cid = <string>action.payload;
      break;
    }
    case ACTIONS.LOADING: {
      newState.loading = <boolean>action.payload;
      break;
    }
    case ACTIONS.SET_PKEY:
      newState.pKey = <string | null>action.payload;
      break;
    case ACTIONS.SET_TX:
      newState.txs.add({
        id: <string>action.payload,
        notified: false
      });
      break;
    case ACTIONS.REMOVE_TX:
      newState.txs.delete(<TxItem>action.payload);
      break;

    case ACTIONS.SET_TX_NOTIFY:
      newState.txs.delete(<TxItem>action.payload);
      newState.txs.add({
        id: (<TxItem>action.payload).id,
        notified: true
      });
      break;

    default:
  }

  return newState;
};

export default reducer;
