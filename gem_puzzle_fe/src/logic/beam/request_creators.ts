import { ApiArgs } from 'beamApiProps';
import {
  ReqRoles,
  ReqMethods,
  ReqActions,
  ReqID,
  AppSpecs
} from '../../constants/api';
import { argsParser } from '../../utils/string_handlers';
import { Store } from '../store/state_handler';

export const RC = {

  viewAssetInfo: (aid: number): ApiArgs => ({
    callID: ReqID.VIEW_ASSET_INFO,
    method: ReqMethods.GET_ASSET_INFO,
    params: {
      create_tx: false,
      asset_id: aid
    }
  } as const),

  txAssetTx: (aid: number, tx: string): ApiArgs => ({
    callID: ReqID.VIEW_ASSET_INFO_TX,
    method: ReqMethods.GET_ASSET_INFO,
    params: {
      asset_id: aid,
      txId: tx
    }
  } as const),

  txAssetInfo: (aid: number, txId?: string): ApiArgs => {
    const args:ApiArgs = {
      callID: ReqID.TX_ASSET_INFO,
      method: ReqMethods.TX_ASSET_INFO,
      params: {
        asset_id: aid
      }
    };
    if (txId) {
      args.params.txId = txId;
    }
    return args;
  },

  startGame: (): ApiArgs => {
    const bet = Store.getState().cid.max_bet;
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.NEW_GAME,
      cid: AppSpecs.CID,
      just_generate: 1,
      bet
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

  viewBoard: (): ApiArgs => {
    const bet = Store.getState().cid.max_bet;
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.NEW_GAME,
      cid: AppSpecs.CID,
      just_generate: 0,
      bet
    });
    return ({
      callID: ReqID.VIEW_BOARD,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  viewCidParams: ():ApiArgs => {
    const args = argsParser({
      role: ReqRoles.MANAGER,
      action: ReqActions.VIEW_CONTRACT_PARAMS,
      cid: AppSpecs.CID
    });
    return {
      callID: ReqID.VIEW_CONTRACT_PARAMS,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const;
  },

  invokeData: (data: number[]): ApiArgs => ({
    callID: ReqID.INVOKE_DATA,
    method: ReqMethods.PROCESS_INVOKE_DATA,
    params: {
      data
    }
  } as const),

  viewTxStatus: (txId: string): ApiArgs => (
    {
      callID: ReqID.TX_STATUS,
      method: ReqMethods.TX_STATUS,
      params: {
        txId
      }
    } as const
  ),

  checkSolution: (sol: string, permutation: number): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.CHECK_SOLUTION,
      solution: sol,
      cid: AppSpecs.CID,
      permutation
    });
    return ({
      callID: ReqID.CHECK_SOLUTION,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    }) as const;
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
    }) as const;
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
    }) as const;
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
    }) as const;
  },

  donate: (sum: number): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.DONATE,
      cid: AppSpecs.CID,
      amount: sum
    });
    return ({
      callID: ReqID.DONATE,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  },

  viewPrizeFund: (): ApiArgs => {
    const args = argsParser({
      role: ReqRoles.PLAYER,
      action: ReqActions.VIEW_PRIZE_FUND,
      cid: AppSpecs.CID
    });
    return ({
      callID: ReqID.VIEW_PRIZE_FUND,
      method: ReqMethods.INVOKE_CONTRACT,
      params: {
        create_tx: false,
        args
      }
    } as const);
  }
};
