import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import wasm from '@assets/app.wasm';
import { BeamApiRes } from '@types';
import { BeamAPI } from '@libs/beam';
import { AppThunkDispatch, RootState } from '../store';
import AC from './action-creators';
import { RequestCreators } from './request-creators';
import { errorHandler } from './error-handlers';

type ThunkActionT = ThunkAction<Promise<void>, RootState, unknown, AnyAction>;

type ThunkCbType = (dispatch: AppThunkDispatch) => (res: BeamApiRes) => void;

let beam: BeamAPI | null = null;

const messageBeam = {
  type: 'create_beam_api',
  apiver: 'current',
  apivermin: '',
  appname: 'BEAM NFT-GALLERY'
};

export const thunks = {
  connectBeamApi:
    (message: {
      [key: string]: string
    } = messageBeam): ThunkActionT => async (dispatch) => {
      beam = new BeamAPI();
      beam.loadAPI(message)
        .then((data) => {
          data.initContract(wasm, () => {
            dispatch(AC.setLoading(false));
          });
        })
        .catch(() => dispatch(
          AC.setError({
            message: 'connection failed',
            code: 0,
            status: 'error'
          })
        ));
    },

  callApi: (
    reqCreator: RequestCreators,
    callback: ThunkCbType
  ):ThunkActionT => async (dispatch:AppThunkDispatch) => {
    beam?.callApi(
      reqCreator,
      errorHandler(dispatch)(callback(dispatch))
    );
  }
};
