import {
  AddObserversType,
  BeamApiHandlers,
  CallApiType,
  DeleteObserverType,
  InitShaderType
} from 'beamApiProps';

export class BEAM {
  static addObservers: AddObserversType;

  static callApi: CallApiType;

  static initShader: InitShaderType;

  static deleteObserver: DeleteObserverType;

  static setApiHandlers = (obj: BeamApiHandlers): void => {
    BEAM.addObservers = obj.addObservers;
    BEAM.callApi = obj.callApi;
    BEAM.initShader = obj.initShader;
    BEAM.deleteObserver = obj.deleteObserver;
  };
}
