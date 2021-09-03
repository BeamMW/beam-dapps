import { IAppState, INewState } from 'AppStateProps';
import { AddObserversType } from 'beamApiProps';
import BaseComponent from '../../components/base/base.component';
import { AppStateActions } from '../../constants/app_constants';
import { ActionTypes } from './app_action_creators';

const initialState:IAppState = {
  mode: 4,
  move: '',
  time: 0,
  picture: 'none',
  pKey: '',
  rate: 1
};

export default class AppState {
  state: IAppState;

  private readonly observers: Set<BaseComponent>;

  constructor() {
    this.state = initialState;
    this.observers = new Set();
  }

  addObservers:AddObserversType = (...components): void => {
    components.forEach((component) => {
      this.observers.add(component);
      component.element
        .addEventListener(
          'DOMNodeRemovedFromDocument', () => this.deleteObserver(component)
        );
    });
  };

  notifyAll = (): void => this.observers.forEach((subs) => {
    if (subs.appInform) {
      subs.appInform(this.state);
    }
  });

  dispatch = (action: ActionTypes): void => {
    this.reducer(action);
  };

  getState = ():IAppState => this.state;

  onApiResult = (json: string): void => {
    this.observers.forEach((element: BaseComponent) => {
      if (element.inform) element.inform(JSON.parse(json));
    });
  };

  setState = (newState: INewState):void => {
    this.state = { ...this.state, ...newState };
  };

  deleteObserver:(
    component: BaseComponent
  ) => void = (component: BaseComponent) => {
    this.observers.delete(component);
  };

  reducer = (obj: ActionTypes): void => {
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
      default:
        break;
    }
    this.notifyAll();
  };
}
