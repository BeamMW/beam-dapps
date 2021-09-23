import { PlayerInfoType, PropertiesType } from 'beamApiProps';
import { IAppState } from 'AppStateProps';
import { BaseReducer } from './base.reducer';
import { AC } from '../app_action_creators';
import { StoreActions } from '../../../constants/app';

const initialState: IAppState = {
  activeGame: false,
  move: '',
  time: 0,
  pKey: '...',
  rate: 0.01,
  autoPlay: false,
  reward: 0,
  isTx: false
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
      case StoreActions.SET_TIME:
        this.state.time = payload as number;
        break;
      case StoreActions.SET_MOVE:
        this.state.move = payload as string;
        break;
      case StoreActions.SET_RATE:
        this.state.rate = payload as number;
        break;
      case StoreActions.SET_MY_INFO:
        this.state.pKey = (<PlayerInfoType>payload)['My public key'];
        this.state.activeGame = (<PlayerInfoType>payload).has_active_game;
        this.state.reward = (<PlayerInfoType>payload).pending_rewards;
        break;
      case StoreActions.SET_AUTOPLAY:
        this.state.autoPlay = payload as boolean;
        break;
      case StoreActions.SET_REWARD:
        this.state.reward = payload as number;
        break;
      case StoreActions.SET_TX:
        this.state.isTx = payload as boolean;
        break;
      default:
        break;
    }
  };
}
