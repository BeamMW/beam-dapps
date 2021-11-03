import { ApiArgs } from 'beamApiProps';
import { ReqID, ReqMethods } from '../../constants/variables';
import { BEAM } from '../../controllers';

export const RC = {
  submitResult: (id:string, args: string): ApiArgs => ({
    callID: id,
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
  invokeData: (id: string, data: number[]): ApiArgs => ({
    callID: id,
    method: ReqMethods.PROCESS_INVOKE_DATA,
    params: {
      data
    }
  } as const),
  txStatus: (id: string, txId: string): ApiArgs => ({
    callID: id,
    method: ReqMethods.TX_STATUS,
    params: {
      txId
    }
  } as const)
};
