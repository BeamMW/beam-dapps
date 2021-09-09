import { IAppState, INewState } from 'AppStateProps';
import { AddObserversType } from 'beamApiProps';
import BaseComponent from '../../components/base/base.component';
import { AppStateActions, BoardView } from '../../constants/app_constants';
import { ActionTypes } from './app_action_creators';

const initialState:IAppState = {
  activeGame: false,
  mode: 4,
  move: '',
  time: 0,
  pKey: '...',
  picOpt: BoardView.NUMBERS,
  rate: 0.01,
  autoPlay: true,
  reward: 0
};

export default class AppState {
  private state: IAppState;

  private readonly observers: Set<BaseComponent>;

  constructor() {
    this.state = initialState;
    this.observers = new Set();
  }

  readonly getState = ():IAppState => this.state;

  readonly dispatch = (action: ActionTypes): void => {
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

  private readonly setState = (newState: INewState):void => {
    this.state = { ...this.state, ...newState };
  };

  private readonly deleteObserver:(
    component: BaseComponent
  ) => void = (component: BaseComponent) => {
    this.observers.delete(component);
  };

  private readonly reducer = (obj: ActionTypes): void => {
    const { action, payload } = obj;
    switch (action) {
      case AppStateActions.SET_TIME:
        this.setState({ time: payload as number });
        break;
      case AppStateActions.SET_MOVE:
        this.setState({ move: payload as string });
        break;
      case AppStateActions.SET_MODE:
        this.setState({ mode: payload as 3 | 4 | 5 });
        break;
      case AppStateActions.SET_RATE:
        this.setState({ rate: payload as number });
        break;
      case AppStateActions.SET_PKEY:
        this.setState({ pKey: payload as string });
        break;
      case AppStateActions.SET_PIC_OPT:
        this.setState({ picOpt: payload as BoardView });
        break;
      case AppStateActions.SET_ACTIVE:
        this.setState({ activeGame: payload as boolean });
        break;
      case AppStateActions.SET_AUTOPLAY:
        this.setState({ autoPlay: payload as boolean });
        break;
      case AppStateActions.SET_REWARD:
        this.setState({ reward: payload as number });
        break;
      default:
        break;
    }
    this.notifyAll();
  };
}
