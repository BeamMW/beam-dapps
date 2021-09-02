import { AddObserversType } from 'beamApiProps';

export class AppStateHandler {
  static addObservers: AddObserversType;

  static dispatch: any;

  static setApiHandlers = (obj: any): void => {
    AppStateHandler.addObservers = obj.addObservers;
    AppStateHandler.dispatch = obj.callApi;
  };
}
