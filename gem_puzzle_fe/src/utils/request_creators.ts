import {
  ReqRoles,
  ReqMethods,
  ReqActions,
  ReqID,
  AppSpecs
} from '../constants/api_constants';
import { ApiHandler } from './api_handler';

export type ReqArgsType = {
  action: ReqActions;
  role: ReqRoles;
  cid?: AppSpecs.CID;
  cancel_previous_game?: 1;
};

const argsParser = (args: ReqArgsType) => Object.entries(args)
  .map((arg) => arg.join('='))
  .join(',');

export const startGame = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.NEW_GAME,
    cid: AppSpecs.CID,
    cancel_previous_game: 1
  });
  ApiHandler.callApi(ReqID.START_GAME, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const invokeData = (data: number[]): void => {
  ApiHandler.callApi(ReqID.INVOKE_DATA, ReqMethods.PROCESS_INVOKE_DATA, {
    data
  });
};

export const viewBoard = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.VIEW_CURRENT_BOARD,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.VIEW_BOARD, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const viewContracts = ():void => {
  const args = argsParser({
    role: ReqRoles.MANAGER,
    action: ReqActions.VIEW_CONTRACTS
  });
  ApiHandler.callApi(ReqID.VIEW_CONTRACTS, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const txStatus = (txId:string): void => {
  setTimeout(() => {
    ApiHandler.callApi(ReqID.TX_STATUS, ReqMethods.TX_STATUS, {
      txId
    });
  }, AppSpecs.TX_CHECK_INTERVAL);
};

export const cancelGame = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.END_CURRENT_GAME,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.CANCEL_GAME, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const destroyContract = ():void => {
  const args = argsParser({
    role: ReqRoles.MANAGER,
    action: ReqActions.DESTROY_CONTRACT,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.DESTROY_CONTRACT, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const createContract = ():void => {
  const args = argsParser({
    role: ReqRoles.MANAGER,
    action: ReqActions.CREATE_CONTRACT
  });
  ApiHandler.callApi(ReqID.CREATE_CONTRACT, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};
