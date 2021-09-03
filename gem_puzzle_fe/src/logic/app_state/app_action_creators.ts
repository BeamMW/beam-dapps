import { AppStateActions } from '../../constants/app_constants';

type ActionCreatorType<T> = (payloaad: T) => {
  action: AppStateActions, payload: T
};

export const setTimeAC:ActionCreatorType<number> = (payload:number) => ({
  action: AppStateActions.SET_TIME,
  payload
});

export const setMoveAC:ActionCreatorType<string> = (payload:string) => ({
  action: AppStateActions.SET_MOVE,
  payload
});

export const setModeAC:ActionCreatorType<3 | 4 | 5> = (payload:3 | 4 | 5) => ({
  action: AppStateActions.SET_MODE,
  payload
});

export const setRateAC:ActionCreatorType<number> = (payload:number) => ({
  action: AppStateActions.SET_RATE,
  payload
});

export const setPKeyAC:ActionCreatorType<string> = (payload:string) => ({
  action: AppStateActions.SET_PKEY,
  payload
});

export type ActionTypes = ReturnType<
typeof setTimeAC
| typeof setMoveAC
| typeof setRateAC
>;
