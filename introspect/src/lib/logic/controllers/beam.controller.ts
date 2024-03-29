import {
  AddObserversType, CallApiType, InitShaderType, BeamApiHandlers
} from '@alltypes';

export default class BEAM {
  static subscribe: AddObserversType;

  static callApi: CallApiType;

  static initShader: InitShaderType;

  static setApiHandlers = (obj: BeamApiHandlers): void => {
    BEAM.subscribe = obj.subscribe;
    BEAM.callApi = obj.callApi;
    BEAM.initShader = obj.initShader;
  };
}
