import {
  APIMethods,
  ContractActions,
  ApiId,
  AppSpecs
} from '../constants/api_constants';
import { ApiHandler } from './api_handler';

export const startGame = (): void => {
  const args = `
    role=player,
    action=${ContractActions.NEW_GAME},
    cid=${AppSpecs.CID}
  `;
  ApiHandler.callApi(ApiId.START_GAME, APIMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args: args.replace(/\s+/g, '')
  });
};

export const viewBoard = (): void => {
  const args = `
  role=player,
  action=${ContractActions.VIEW_CURRENT_BOARD},
  cid=${AppSpecs.CID}
`;
  ApiHandler.callApi(ApiId.VIEW_BOARD, APIMethods.INVOKE_CONTRACT, {
    create_tx: false,
    args: args.replace(/\s+/g, '')
  });
};
