import { IAppState, PropertiesType } from 'AppStateProps';
import { AddObserversType, PlayerInfoType } from 'beamApiProps';
import BaseComponent from '../../components/base/base.component';
import { AppStateActions } from '../../constants/app_constants';
import { AC } from './app_action_creators';

const initialState:IAppState = {
  activeGame: false,
  move: '',
  time: 0,
  pKey: '...',
  rate: 0.01,
  autoPlay: false,
  reward: 0,
  isTx: false
};

export default class AppState {
  private state: IAppState;

  private readonly observers: Set<BaseComponent>;

  constructor() {
    this.state = initialState;
    this.observers = new Set();
  }

  readonly getState = ():IAppState => this.state;

  readonly dispatch = (action: ReturnType<
  PropertiesType<typeof AC>
  >): void => {
    this.reducer(action);
  };

  private readonly notifyAll = (): void => this.observers.forEach((subs) => {
    if (subs.appInform) {
      subs.appInform(this.state);
    }
  });

  readonly addObservers:AddObserversType = (...components): void => {
    components.forEach((component) => {
      this.observers.add(component);
      component.element
        .addEventListener(
          'DOMNodeRemovedFromDocument', () => this.deleteObserver(component)
        );
    });
  };

  private readonly setState = (newState: Partial<IAppState>):void => {
    this.state = { ...this.state, ...newState };
  };

  private readonly deleteObserver:(
    component: BaseComponent
  ) => void = (component: BaseComponent) => {
    this.observers.delete(component);
  };

  private readonly reducer = (obj: ReturnType<
  PropertiesType<typeof AC>
  >): void => {
    const { action, payload } = obj;
    switch (action) {
      case AppStateActions.SET_TIME:
        this.setState({ time: payload as number });
        break;
      case AppStateActions.SET_MOVE:
        this.setState({ move: payload as string });
        break;
      case AppStateActions.SET_RATE:
        this.setState({ rate: payload as number });
        break;
      case AppStateActions.SET_MY_INFO:
        this.setState(
          {
            pKey: (<PlayerInfoType>payload)['My public key'],
            activeGame: (<PlayerInfoType>payload).has_active_game,
            reward: (<PlayerInfoType>payload).pending_rewards
          }
        );
        break;
      case AppStateActions.SET_AUTOPLAY:
        this.setState({ autoPlay: payload as boolean });
        break;
      case AppStateActions.SET_REWARD:
        this.setState({ reward: payload as number });
        break;
      case AppStateActions.SET_TX:
        this.setState({ isTx: payload as boolean });
        break;
      default:
        break;
    }
    this.notifyAll();
  };
}
