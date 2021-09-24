import { PropertiesType } from 'beamApiProps';
import { ICidState } from 'AppStateProps';
import { BaseReducer } from './base.reducer';
import { AC } from '../app_action_creators';
import { CidActions } from '../../../constants/app';

const initialState: ICidState = {
  max_bet: 0,
  multiplier: 0,
  free_time: 0,
  game_speed: 0,
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
        this.state.free_time = (payload as ICidState).free_time;
        this.state.multiplier = (payload as ICidState).multiplier;
        this.state.game_speed = (payload as ICidState).game_speed;
        this.state.prize_aid = (payload as ICidState).prize_aid;
        break;
      default:
        break;
    }
  };
}
