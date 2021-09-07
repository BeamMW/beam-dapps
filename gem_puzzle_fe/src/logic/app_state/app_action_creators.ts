import { BoardLengthType } from 'beamApiProps';
import { AppStateActions, BoardView } from '../../constants/app_constants';

type ActionCreatorType<T> = (payloaad: T) => {
  action: AppStateActions, payload: T
};

export const setTimeAC:ActionCreatorType<number> = (payload) => ({
  action: AppStateActions.SET_TIME,
  payload
});

export const setMoveAC:ActionCreatorType<string> = (payload) => ({
  action: AppStateActions.SET_MOVE,
  payload
});

export const setModeAC:ActionCreatorType<BoardLengthType> = (
  payload
) => ({
  action: AppStateActions.SET_MODE,
  payload
});

export const setRateAC:ActionCreatorType<number> = (payload) => ({
  action: AppStateActions.SET_RATE,
  payload
});

export const setPKeyAC:ActionCreatorType<string> = (payload) => ({
  action: AppStateActions.SET_PKEY,
  payload
});

export const setPicOptAC:ActionCreatorType<BoardView> = (payload) => ({
  action: AppStateActions.SET_PIC_OPT,
  payload
});

export const setActiveGameAC:ActionCreatorType<boolean> = (payload) => ({
  action: AppStateActions.SET_ACTIVE,
  payload
});

export const setAutoplayAC:ActionCreatorType<boolean> = (payload) => ({
  action: AppStateActions.SET_AUTOPLAY,
  payload
});

export type ActionTypes = ReturnType<
typeof setTimeAC
| typeof setMoveAC
| typeof setRateAC
| typeof setModeAC
| typeof setPKeyAC
| typeof setPicOptAC
| typeof setActiveGameAC
| typeof setAutoplayAC
>;
