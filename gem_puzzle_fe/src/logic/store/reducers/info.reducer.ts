import { PropertiesType } from 'beamApiProps';
import { IAppState } from 'AppStateProps';
import { BaseReducer } from './base.reducer';
import { AC } from '../app_action_creators';
import { StoreActions } from '../../../constants/app';

const initialState: IAppState = {
  has_active_game: 0,
  time: 0,
  autoPlay: false,
  pending_rewards: 0,
  isTx: false,
  popup: false,
  prizeFund: 0
};

export class InfoState implements BaseReducer<IAppState> {
  state: IAppState = initialState;

  key = 'info';

  setState = (newState: Partial<IAppState>): void => {
    this.state = { ...this.state, ...newState };
  };

  reducer = (obj: ReturnType<PropertiesType<typeof AC>>): void => {
    const { action, payload } = obj;
    switch (action) {
      case StoreActions.SET_MY_INFO:
        this.state.has_active_game = (<IAppState>payload).has_active_game;
        this.state.pending_rewards = (<IAppState>payload).pending_rewards;
        break;
      case StoreActions.SET_AUTOPLAY:
        this.state.autoPlay = payload as boolean;
        break;
      case StoreActions.SET_TX:
        this.state.isTx = payload as boolean;
        break;
      case StoreActions.SET_POPUP:
        this.state.popup = payload as IAppState['popup'];
        break;
      case StoreActions.SET_PRIZE_FUND:
        this.state.prizeFund = payload as IAppState['prizeFund'];
        break;
      default:
        break;
    }
  };
}
