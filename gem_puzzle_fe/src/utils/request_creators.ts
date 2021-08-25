import {
  ReqMethods,
  ReqActions,
  ReqID,
  AppSpecs
} from '../constants/api_constants';
import { ApiHandler } from './api_handler';

export const startGame = (): void => {
  const args = `
    role=player,
    action=${ReqActions.NEW_GAME},
    cid=${AppSpecs.CID}
  `;
  ApiHandler.callApi(ReqID.START_GAME, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args: args.replace(/\s+/g, '')
  });
};

export const invokeData = (data: number[]): void => {
  ApiHandler.callApi(ReqID.INVOKE_DATA, ReqMethods.PROCESS_INVOKE_DATA, {
    data
  });
};

export const viewBoard = (): void => {
  const args = `
  role=player,
  action=${ReqActions.VIEW_CURRENT_BOARD},
  cid=${AppSpecs.CID}
`;
  ApiHandler.callApi(ReqID.VIEW_BOARD, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args: args.replace(/\s+/g, '')
  });
};

export const exit = (): void => {
  const args = `
    role=player,
    action=${ReqActions.NEW_GAME},
    cid=${AppSpecs.CID},
    cancel_previous_game=1
  `;
  ApiHandler.callApi(ReqID.EXIT_GAME, ReqMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args: args.replace(/\s+/g, '')
  });
};
