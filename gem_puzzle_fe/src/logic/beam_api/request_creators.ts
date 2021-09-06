import { AppStateHandler } from '../app_state/state_handler';
import {
  ReqRoles,
  ReqMethods,
  ReqActions,
  ReqID,
  AppSpecs
} from '../../constants/api_constants';
import { ApiHandler } from './api_handler';
import { parseToGroth } from '../../utils/string_handlers';

export type ReqArgsType = {
  action: ReqActions;
  role: ReqRoles;
  solution?: string;
  cid?: AppSpecs.CID;
  cancel_previous_game?: 1;
  bet?: string
};

const argsParser = (args: ReqArgsType) => Object.entries(args)
  .map((arg) => arg.join('='))
  .join(',');

export const startGame = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.NEW_GAME,
    cid: AppSpecs.CID,
    bet: parseToGroth(AppStateHandler.getState().rate)
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

export const invokeDataSolution = (data: number[]): void => {
  ApiHandler.callApi(
    ReqID.INVOKE_DATA_SOLUTION,
    ReqMethods.PROCESS_INVOKE_DATA,
    {
      data
    }
  );
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

export const viewContracts = (): void => {
  const args = argsParser({
    role: ReqRoles.MANAGER,
    action: ReqActions.VIEW_CONTRACTS
  });
  ApiHandler.callApi(ReqID.VIEW_CONTRACTS, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};

export const txStatus = (txId: string): void => {
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

export const destroyContract = (): void => {
  const args = argsParser({
    role: ReqRoles.MANAGER,
    action: ReqActions.DESTROY_CONTRACT,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.DESTROY, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};
export const checkSolution = (sol: string): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.CHECK_SOLUTION,
    solution: sol,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.CHECK_SOLUTION, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};
export const viewCheckResult = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.VIEW_CHECK_RESULT,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.VIEW_CHECK_RESULT, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};
export const checkSolutionTx = (txId: string): void => {
  setTimeout(() => {
    ApiHandler.callApi(ReqID.TX_CHECK_SOLUTION, ReqMethods.TX_STATUS, {
      txId
    });
  }, AppSpecs.TX_CHECK_INTERVAL);
};

export const getPlayerKey = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.GET_MY_PKEY,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.GET_PKEY, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};
export const viewTops = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.VIEW_TOPS,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.VIEW_TOPS, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
}
export const takePendingRewards = (): void => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.TAKE_PENDING_REWARDS,
      cid: AppSpecs.CID
    });
    ApiHandler.callApi(ReqID.TAKE_PENDING_REWARDS, ReqMethods.INVOKE_CONTRACT, {
      create_tx: false,
      args
    });
};
export const viewMyPendingRewards = (): void => {
  const args = argsParser({
    role: ReqRoles.PLAYER,
    action: ReqActions.VIEW_MY_PENDING_REWARDS,
    cid: AppSpecs.CID
  });
  ApiHandler.callApi(ReqID.VIEW_MY_PENDING_REWARDS, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args
  });
};
