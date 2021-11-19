import { argsStringify } from '@libs/utils';
import { PropertiesType } from '@types';

export const RC = {
  getAllItems: (cid: string) => ({
    callID: 'view_all',
    method: 'invoke_contract',
    params: {
      args: argsStringify({
        role: 'user',
        action: 'view_all',
        cid
      }),
      create_tx: false
    }
  } as const),

  getPic: (id: number, cid: string) => ({
    callID: 'get_pic',
    method: 'invoke_contract',
    params: {
      args: argsStringify({
        role: 'user',
        action: 'download',
        cid,
        id: String(id)
      }),
      create_tx: false
    }
  } as const),

  getPKey: (cid: string) => ({
    callID: 'get_key',
    method: 'invoke_contract',
    params: {
      args: argsStringify({
        role: 'artist',
        action: 'get_key',
        cid
      }),
      create_tx: false
    }
  }),

  uploadImage: (data: string, key: string, cid: string) => ({
    callID: 'upload',
    method: 'invoke_contract',
    params: {
      args: argsStringify({
        role: 'manager',
        action: 'upload',
        cid,
        pkArtist: key,
        data
      }),
      create_tx: false
    }
  } as const),

  startTx: (data: number[]) => ({
    callID: 'start_tx',
    method: 'process_invoke_data',
    params: { data }
  }),

  getTxStatus: (txId: string) => ({
    callID: `tx_status_${txId}`,
    method: 'tx_status',
    params: {
      txId
    }
  })
};
export type RequestCreators = ReturnType<PropertiesType<typeof RC>>;
