import { ActionCreators } from '../action-creators/action-creators';
import { ACTIONS } from '../constants';

interface IApp {
  cid: string
  pKey: string | null,
  loading: boolean,
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
  pKey: null
};

const reducer = (
  state:IApp = initialState, action: ActionCreators
):IApp => {
  const newState = JSON.parse(JSON.stringify(state)) as IApp;
  switch (action.type) {
    case ACTIONS.SET_CID: {
      newState.cid = action.payload as string;
      break;
    }
    case ACTIONS.LOADING: {
      newState.loading = action.payload as boolean;
      break;
    }
    case ACTIONS.SET_PKEY:
      newState.pKey = action.payload as string | null;
      break;
    default:
  }

  return newState;
};

export default reducer;
