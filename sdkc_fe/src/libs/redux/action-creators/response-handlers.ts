import { parseToUrl } from '@libs/utils';
import { BeamApiRes } from '@types';
import { thunks } from './thunks';
import { AppThunkDispatch } from '../store';
import AC from './action-creators';
import { RC } from './request-creators';

export const onResponse = {
  getItems: () => (dispatch: AppThunkDispatch) => (items: BeamApiRes) => {
    const output = JSON.parse(
      items.result.output!
    ) as { items: { id:number }[] };
    dispatch(AC.setItems(output.items
      .map((el) => ({ id: el.id, pic: null, name: '' }))));
  },

  startTx: () => () => (items: BeamApiRes) => {
    try {
      if (items.result.txId || items.result.txid) {
        console.log(items.result.txId || items.result.txid);
      }
    } catch {
      console.log('somethin went wrong');
    }
  },

  getPic: (
    id: number
  ) => (dispatch: AppThunkDispatch) => (pics: BeamApiRes) => {
    const output = JSON.parse(
      pics.result.output!
    ) as { data: string };
    dispatch(AC.setPic({ id, ...parseToUrl(output.data) }));
  },

  getPKey: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    const output = JSON.parse(
      res.result.output!
    ) as { key: string };
    dispatch(AC.setPKey(output.key));
  },

  uploadImage: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    if (res.result.raw_data) {
      dispatch(thunks.callApi(
        RC.startTx(res.result.raw_data), onResponse.startTx()
      ));
    }
  }
};
