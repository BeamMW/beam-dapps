import { BoardLengthType, PlayerInfoType } from 'beamApiProps';
import { AppStateActions } from '../../constants/app_constants';

export const AC = {
  setTime: (payload:number) => ({
    action: AppStateActions.SET_TIME,
    payload
  } as const),
  setMove: (payload:string) => ({
    action: AppStateActions.SET_MOVE,
    payload
  } as const),
  setMode: (
    payload: BoardLengthType
  ) => ({ action: AppStateActions.SET_MODE, payload } as const),
  setRate: (payload: number) => ({
    action: AppStateActions.SET_RATE,
    payload
  } as const),
  setPKey: (payload: string) => ({
    action: AppStateActions.SET_PKEY,
    payload
  } as const),
  setActiveGame: (payload: boolean) => ({
    action: AppStateActions.SET_ACTIVE,
    payload
  } as const),
  setAutoplay: (payload: boolean) => ({
    action: AppStateActions.SET_AUTOPLAY,
    payload
  } as const),
  setMyPendingReward: (payload:number) => ({
    action: AppStateActions.SET_REWARD,
    payload
  } as const),
  setIsTx: (payload: boolean) => ({
    action: AppStateActions.SET_TX,
    payload
  } as const),
  setMyInfo: (payload:PlayerInfoType) => ({
    action: AppStateActions.SET_MY_INFO,
    payload
  } as const)
};
