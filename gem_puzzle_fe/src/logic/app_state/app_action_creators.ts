import { AppStateActions } from '../../constants/app_actions';

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

export const setRateAC:ActionCreatorType<number> = (payload:number) => ({
  action: AppStateActions.SET_RATE,
  payload
});

export type ActionTypes = ReturnType<
typeof setTimeAC
| typeof setMoveAC
| typeof setRateAC
>;
