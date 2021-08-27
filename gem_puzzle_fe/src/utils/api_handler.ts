import { AddObserversType, BeamApiHandlers, CallApiType } from 'beamApiProps';

export class ApiHandler {
  static addObservers: AddObserversType;

  static callApi: CallApiType;

  static setApiHandlers = (obj: BeamApiHandlers): void => {
    ApiHandler.addObservers = obj.addObservers;
    ApiHandler.callApi = obj.callApi;
  };
}
