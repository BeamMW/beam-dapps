import { IState, PropertiesType } from 'AppStateProps';
import { AddObserversType } from 'beamApiProps';
import { AC } from './app_action_creators';

export class Store {
  static addObservers: AddObserversType;

  static dispatch: (action: ReturnType<
  PropertiesType<typeof AC>
  >) => void;

  static getState: () => IState;

  static setAppHandlers = (obj: {
    addObservers: AddObserversType,
    dispatch: (action: ReturnType<
    PropertiesType<typeof AC>
    >) => void,
    getState: () => IState
  }): void => {
    Store.addObservers = obj.addObservers;
    Store.dispatch = obj.dispatch;
    Store.getState = obj.getState;
  };
}
