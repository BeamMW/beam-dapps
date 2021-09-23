import { IGridState } from 'AppStateProps';
import { BoardLengthType, BoardType, PlayerInfoType } from 'beamApiProps';
import { GridActions, StoreActions } from '../../constants/app';

export const AC = {
  setTime: (payload:number) => ({
    action: StoreActions.SET_TIME,
    payload
  } as const),
  setMove: (payload:string) => ({
    action: StoreActions.SET_MOVE,
    payload
  } as const),
  setMode: (
    payload: BoardLengthType
  ) => ({ action: StoreActions.SET_MODE, payload } as const),
  setRate: (payload: number) => ({
    action: StoreActions.SET_RATE,
    payload
  } as const),
  setPKey: (payload: string) => ({
    action: StoreActions.SET_PKEY,
    payload
  } as const),
  setActiveGame: (payload: boolean) => ({
    action: StoreActions.SET_ACTIVE,
    payload
  } as const),
  setAutoplay: (payload: boolean) => ({
    action: StoreActions.SET_AUTOPLAY,
    payload
  } as const),
  setMyPendingReward: (payload:number) => ({
    action: StoreActions.SET_REWARD,
    payload
  } as const),
  setIsTx: (payload: boolean) => ({
    action: StoreActions.SET_TX,
    payload
  } as const),
  setMyInfo: (payload:PlayerInfoType) => ({
    action: StoreActions.SET_MY_INFO,
    payload
  } as const),
  setGrid: (payload: BoardType) => ({
    action: GridActions.SET_GRID,
    payload
  } as const),
  setSolution: (payload: ('u' | 'd' | 'r' | 'l')[]) => ({
    action: GridActions.SET_SOLUTION,
    payload
  } as const),
  setStatus: (payload:'ready' | 'playing' | 'won') => ({
    action: GridActions.SET_STATUS,
    payload
  } as const),
  setGame: (payload: Omit<IGridState, 'time'>) => ({
    action: GridActions.SET_GAME,
    payload
  } as const)
};
