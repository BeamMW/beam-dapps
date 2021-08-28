import {
  AddObserversType,
  BeamApiHandlers,
  CallApiType,
  InitShaderType
} from 'beamApiProps';

export class ApiHandler {
  static addObservers: AddObserversType;

  static callApi: CallApiType;

  static initShader: InitShaderType;

  static setApiHandlers = (obj: BeamApiHandlers): void => {
    ApiHandler.addObservers = obj.addObservers;
    ApiHandler.callApi = obj.callApi;
    ApiHandler.initShader = obj.initShader;
  };
}
