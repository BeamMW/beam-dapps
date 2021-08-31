import { ShaderProps, ReqID, ReqMethods } from '../constants/variables';
import { ApiHandler } from './api_handlers';

export const submitResult = (args:string): void => {
  ApiHandler.callApi(ReqID.SUBMIT_RESULT, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const createForm = (files: ArrayBuffer): void => {
  ApiHandler.initShader(files);
  ApiHandler.callApi(ReqID.FORM_GENERATOR, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false
  });
};

export const invokeData = (id: ReqID, data: number[]):void => {
  ApiHandler.callApi(id, ReqMethods.PROCESS_INVOKE_DATA, {
    data
  });
};

export const txStatus = (txId:string): void => {
  setTimeout(() => {
    ApiHandler.callApi(ReqID.TX_STATUS, ReqMethods.TX_STATUS, {
      txId
    });
  }, ShaderProps.TX_CHECK_INTERVAL);
};
