import {
  AddObserversType,
  BeamApiHandlers,
  CallApiType,
  DeleteObserverType,
  InitShaderType
} from 'beamApiProps';

export class ApiHandler {
  static addObservers: AddObserversType;

  static callApi: CallApiType;

  static initShader: InitShaderType;

  static deleteObserver: DeleteObserverType;

  static setApiHandlers = (obj: BeamApiHandlers): void => {
    ApiHandler.addObservers = obj.addObservers;
    ApiHandler.callApi = obj.callApi;
    ApiHandler.initShader = obj.initShader;
    ApiHandler.deleteObserver = obj.deleteObserver;
  };
}
