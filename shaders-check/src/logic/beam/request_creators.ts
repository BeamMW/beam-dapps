import { ApiArgs } from 'beamApiProps';
import { ReqID, ReqMethods } from '../../constants/variables';
import { BEAM } from '../../components/controllers/beam.controller';

export const RC = {
  submitResult: (args: string): ApiArgs => ({
    callID: ReqID.SUBMIT_RESULT,
    method: ReqMethods.INVOKE_CONTRACT,
    params: {
      create_tx: false,
      args
    }
  } as const),
  createForm: (files: ArrayBuffer): ApiArgs => {
    BEAM.initShader(files);
    return ({
      callID: ReqID.FORM_GENERATOR,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false
      }
    } as const);
  },
  invokeData: (id: ReqID, data: number[]): ApiArgs => ({
    callID: id,
    method: ReqMethods.PROCESS_INVOKE_DATA,
    params: {
      data
    }
  } as const),
  txStatus: (txId: string): ApiArgs => ({
    callID: ReqID.TX_STATUS,
    method: ReqMethods.TX_STATUS,
    params: {
      txId
    }
  } as const)
};
