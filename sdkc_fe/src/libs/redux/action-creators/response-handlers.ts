import { hexDecodeU8A } from '@libs/utils';
import { BeamApiRes } from '@types';
import { AppThunkDispatch } from '../store';
import AC from './action-creators';
import { RC } from './request-creators';
import { thunks } from './thunks';

export const onResponse = {
  getItems: () => (dispatch: AppThunkDispatch) => (items: BeamApiRes) => {
    const output = JSON.parse(
      items.result.output!
    ) as { items: { id:number }[] };
    dispatch(AC.setItems(output.items
      .map((el) => ({ id: el.id, pic: null, name: '' }))));
  },

  getPic: (
    id: number
  ) => (dispatch: AppThunkDispatch) => (pics: BeamApiRes) => {
    const output = JSON.parse(
      pics.result.output!
    ) as { data: string };

    const data = hexDecodeU8A(output.data);

    const nend = data.findIndex((val) => val === 0);
    const name = data[0] !== 1 || nend === -1 || nend + 1 === data.length
      ? 'unknown'
      : (new TextDecoder()).decode(data.subarray(1, nend));

    const bytes = data.subarray(nend + 2);
    const pic = URL.createObjectURL(
      new Blob([bytes], { type: 'image/jpeg' })
    );
    dispatch(AC.setPic({ id, pic, name }));
  },

  getPKey: () => (dispatch: AppThunkDispatch) => (res: BeamApiRes) => {
    const output = JSON.parse(
      res.result.output!
    ) as { key: string };
    console.log('get key', output);
    dispatch(AC.setPKey(output.key));
  },

  uploadImage: () => (dispatch: AppThunkDispatch) => () => {
    dispatch(thunks.callApi(RC.getAllItems(), onResponse.getItems()));
  }
};
