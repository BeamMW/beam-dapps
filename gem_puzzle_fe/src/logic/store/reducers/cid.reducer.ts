import { PropertiesType } from 'beamApiProps';
import { ICidState } from 'AppStateProps';
import { AppSpecs } from '../../../constants/api';
import { BaseReducer } from './base.reducer';
import { AC } from '../app_action_creators';
import { CidActions } from '../../../constants/app';

const currentCid = window.localStorage.getItem('cid');

const initialState: ICidState = {
  max_bet: 0,
  min_bet: 0,
  prize_aid: 0,
  prize_amount: 0,
  prize_fund: 0
};

export class CidState implements BaseReducer<ICidState> {
  state: ICidState = initialState;

  key = 'Cid';

  setState = (newState: Partial<ICidState>): void => {
    this.state = { ...this.state, ...newState };
  };

  reducer = (obj: ReturnType<PropertiesType<typeof AC>>): void => {
    const { action, payload } = obj;
    switch (action) {
      case CidActions.SET_CID_PARAMS:
        this.state.max_bet = (payload as ICidState).max_bet;
        this.state.min_bet = (payload as ICidState).min_bet;
        this.state.prize_aid = (payload as ICidState).prize_aid;
        this.state.prize_amount = (payload as ICidState).prize_amount;
        if (currentCid !== AppSpecs.CID) {
          localStorage.setItem('cid', AppSpecs.CID);
          localStorage.removeItem('state');
        }
        break;
      default:
        break;
    }
  };
}
