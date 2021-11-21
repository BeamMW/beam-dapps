import { parseToUrl } from '@libs/utils';
import { BeamApiRes, setPropertiesType, TxResponse } from '@types';
import { thunks } from './thunks';
import { AppThunkDispatch } from '../store';
import AC from './action-creators';
import { RC } from './request-creators';

export const onResponse = {
  getItems: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    const output = JSON.parse(
      res.result.output!
    ) as { items: { id:number }[] };
    dispatch(AC.setItems(output.items
      .map((el) => ({ id: el.id, pic: null, name: '' }))));
  },

  checkTxStatus: (
    callback: setPropertiesType<TxResponse>
  ) => () => (res: BeamApiRes) => {
    callback({
      message: res.result.comment,
      status_string: res.result.status_string
    });
  },

  startTx: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    dispatch(AC.setTx(res.result.txid));
  },

  getPic: (
    id: number
  ) => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    const output = JSON.parse(
      res.result.output!
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
