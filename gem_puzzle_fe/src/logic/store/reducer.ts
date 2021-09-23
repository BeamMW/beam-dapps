import { AddObserversType } from 'beamApiProps';
import { PropertiesType, IState } from 'AppStateProps';
import { InfoState } from './reducers/info.reducer';
import { GridState } from './reducers/grid.reducer';
import BaseComponent from '../../components/base/base.component';
import { AC } from './app_action_creators';

export default class AppState {
  private state: IState;

  private reducers: ((obj:ReturnType<PropertiesType<typeof AC>>) => void)[];

  private readonly observers: Set<BaseComponent>;

  constructor() {
    const reducersInst = {
      grid: new GridState(),
      info: new InfoState()
    };
    this.state = {
      grid: reducersInst.grid.state,
      info: reducersInst.info.state
    };
    this.reducers = [
      reducersInst.grid.reducer,
      reducersInst.info.reducer
    ];
    this.observers = new Set();
  }

  readonly dispatch = (action: ReturnType<
  PropertiesType<typeof AC>
  >): void => {
    this.reducer(action);
  };

  readonly getState = ():IState => this.state;

  private readonly notifyAll = (): void => this.observers.forEach((subs) => {
    const stateCopy = JSON.parse(JSON.stringify(this.state));
    if (subs.appInform) {
      subs.appInform(stateCopy as IState);
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

  private readonly deleteObserver:(
    component: BaseComponent
  ) => void = (component: BaseComponent) => {
    this.observers.delete(component);
  };

  private readonly reducer = (obj: ReturnType<
  PropertiesType<typeof AC>
  >): void => {
    this.reducers.forEach((reducer) => reducer(obj));
    console.log('inform', this.state);
    this.notifyAll();
  };
}
