import { Pic } from '@types';
import { ActionCreators } from '../action-creators/action-creators';
import { ACTIONS } from '../constants';

interface IStore {
  items: Pic[]
}

const initialState:IStore = {
  items: []
};

const reducer = (
  state:IStore = initialState, action: ActionCreators
):IStore => {
  const newState = JSON.parse(JSON.stringify(state)) as IStore;
  switch (action.type) {
    case ACTIONS.SET_TEST_PIC:
      newState.items.push(action.payload as Pic);
      break;
    default:
  }

  return newState;
};

export default reducer;
