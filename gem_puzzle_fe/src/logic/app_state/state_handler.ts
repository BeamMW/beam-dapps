import { IAppState } from 'AppStateProps';
import { AddObserversType } from 'beamApiProps';
import { ActionTypes } from './app_action_creators';

export class AppStateHandler {
  static addObservers: AddObserversType;

  static dispatch: (action: ActionTypes) => void;

  static getState: () => IAppState;

  static setApiHandlers = (obj: {
    addObservers: AddObserversType,
    dispatch: (action: ActionTypes) => void,
    getState: () => IAppState
  }): void => {
    AppStateHandler.addObservers = obj.addObservers;
    AppStateHandler.dispatch = obj.dispatch;
    AppStateHandler.getState = obj.getState;
  };
}
