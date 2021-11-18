import { ActionCreators } from '../action-creators/action-creators';
import { ACTIONS } from '../constants';

type Pic = { id:number, pic: string | null, name: string };

interface IStore {
  items: Pic []
}

const initialState:IStore = {
  items: []
};

const reducer = (
  state:IStore = initialState, action: ActionCreators
):IStore => {
  const newState = JSON.parse(JSON.stringify(state)) as IStore;
  switch (action.type) {
    case ACTIONS.SET_ITEMS:
      newState.items = [
        ...action.payload as Pic[]];
      break;
    case ACTIONS.SET_PIC:
      if ((<Pic>action.payload).pic) {
        newState.items.splice(
          newState.items.findIndex(
            (el) => el.id === (action.payload as Pic).id
          ), 1, action.payload as Pic
        );
      }
      break;
    default:
  }

  return newState;
};

export default reducer;
