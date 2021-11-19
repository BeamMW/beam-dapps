import { parseToUrl } from '@libs/utils';
import { BeamApiRes } from '@types';
import { notification } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification';
import { STATUS } from '../constants';
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

  checkTxStatus: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    const props = {
      message: res.result.comment,
      description: res.result.status_string as React.ReactNode,
      placement: 'bottomRight' as NotificationPlacement
    };
    if (res.result.status_string === STATUS.IN_PROGRESS) {
      notification.open(props);
    } else if (res.result.status_string === STATUS.FAILED) {
      notification.error(props);
    } else if (res.result.status_string === STATUS.COMPLETED) {
      notification.success(props);
    }
    if (res.result.status_string !== STATUS.FAILED
    && res.result.status_string !== STATUS.COMPLETED) {
      setTimeout(() => {
        dispatch(
          thunks.callApi(
            RC.getTxStatus(res.result.txId), onResponse.checkTxStatus()
          )
        );
      }, 2000);
    }
  },

  startTx: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    dispatch(
      thunks.callApi(
        RC.getTxStatus(res.result.txid), onResponse.checkTxStatus()
      )
    );
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
