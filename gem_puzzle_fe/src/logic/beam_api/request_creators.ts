import { ApiArgs } from 'beamApiProps';
import {
  ReqRoles,
  ReqMethods,
  ReqActions,
  ReqID,
  AppSpecs
} from '../../constants/api_constants';
import { parseToGroth } from '../../utils/string_handlers';
import { Store } from '../app_state/state_handler';

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

export const RC = {

  startGame: (): ApiArgs => {
    const { rate } = Store.getState();
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.NEW_GAME,
      cid: AppSpecs.CID,
      bet: parseToGroth(rate)
    });
    return ({
      callID: ReqID.START_GAME,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  invokeData: (data: number[]): ApiArgs => ({
    callID: ReqID.INVOKE_DATA,
    method: ReqMethods.PROCESS_INVOKE_DATA,
    params: {
      data
    }
  } as const),

  viewBoard: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.VIEW_CURRENT_BOARD,
      cid: AppSpecs.CID
    });
    return {
      callID: ReqID.VIEW_BOARD,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const;
  },

  viewTxStatus: (txId: string): ApiArgs => (
    {
      callID: ReqID.TX_STATUS,
      method: ReqMethods.TX_STATUS,
      params: {
        txId
      }
    } as const
  ),

  cancelGame: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.END_CURRENT_GAME,
      cid: AppSpecs.CID
    });
    return ({
      callID: ReqID.CANCEL_GAME,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  checkSolution: (sol: string): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.CHECK_SOLUTION,
      solution: sol,
      cid: AppSpecs.CID
    } as const);
    return ({
      callID: ReqID.CHECK_SOLUTION,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  viewCheckResult: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.VIEW_CHECK_RESULT,
      cid: AppSpecs.CID
    });
    return ({
      callID: ReqID.VIEW_CHECK_RESULT,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  viewTops: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.VIEW_TOPS,
      cid: AppSpecs.CID
    });
    return ({
      callID: ReqID.VIEW_TOPS,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  takePendingRewards: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.TAKE_PENDING_REWARDS,
      cid: AppSpecs.CID
    });
    return ({
      callID: ReqID.TAKE_PENDING_REWARDS,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  viewMyInfo: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.GET_MY_INFO,
      cid: AppSpecs.CID
    });
    return ({
      callID: ReqID.VIEW_MY_INFO,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  }
};
