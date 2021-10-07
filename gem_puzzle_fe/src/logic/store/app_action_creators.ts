import { IGridState, ICidState, IAppState } from 'AppStateProps';
import { CidActions, GridActions, StoreActions } from '../../constants/app';

export const AC = {
  setCidParams: (payload: ICidState) => ({
    action: CidActions.SET_CID_PARAMS,
    payload
  } as const),
  setRate: (payload: number) => ({
    action: StoreActions.SET_RATE,
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
  setAssetName: (payload: {
    name: string,
    color: string
  }) => ({
    action: StoreActions.SET_ASSET_NAME,
    payload
  } as const),
  setMyInfo: (payload:Partial<IAppState>) => ({
    action: StoreActions.SET_MY_INFO,
    payload
  } as const),
  setGame: (payload: Partial<IGridState>) => ({
    action: GridActions.SET_GAME,
    payload
  } as const),
  setPopup: (payload: IAppState['popup']) => ({
    action: StoreActions.SET_POPUP,
    payload
  } as const),
  setPrizeFund: (payload: IAppState['prizeFund']) => ({
    action: StoreActions.SET_PRIZE_FUND,
    payload
  } as const)
};
