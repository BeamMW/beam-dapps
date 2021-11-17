import { PropertiesType } from '@types';
import { CONTRACT } from '../../constants/contract';

export const RC = {
  getAllItems: () => ({
    callID: 'view_all',
    method: 'invoke_contract',
    params: {
      args: `role=user,action=view_all,cid=${CONTRACT.CID}`,
      create_tx: false
    }
  } as const),

  getPic: (id: number) => ({
    callID: 'get_pic',
    method: 'invoke_contract',
    params: {
      args: `role=user,action=download,cid=${CONTRACT.CID},id=${id}`,
      create_tx: false
    }
  } as const),

  getPKey: () => ({
    callID: 'get_key',
    method: 'invoke_contract',
    params: {
      args: `role=artist,action=get_key,cid=${CONTRACT.CID}`,
      create_tx: false
    }
  }),

  uploadImage: (data: string) => ({
    callID: 'upload',
    method: 'invoke_contract',
    params: {
      args: `role=manager,action=upload,pkArtist=${
        1},data=${data}cid=${CONTRACT.CID}`,
      create_tx: false
    }
  } as const)
};
export type RequestCreators = ReturnType<PropertiesType<typeof RC>>;
