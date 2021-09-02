import {
  viewContracts, cancelGame, startGame, viewBoard, destroyContract
} from '../utils/request_creators';

export enum MenuBtn {
  NEW = 'NEW',
  CONTINUE = 'CONTINUE',
  OPTIONS = 'OPTIONS',
  CANCEL = 'CANCEL',
  VIEW_CONTRACTS = 'VIEW_CONTRACTS',
  DESTROY_CONTRACT = 'DESTROY_CONTRACT'
}

export const menuBtn = [
  {
    key: MenuBtn.CONTINUE,
    title: 'CONTINUE',
    handler: viewBoard
  },
  {
    key: MenuBtn.NEW,
    title: 'NEW GAME',
    handler: startGame
  },
  {
    key: MenuBtn.OPTIONS,
    title: 'OPTIONS',
    handler: ():void => {
      // TODO
    }
  },
  {
    key: MenuBtn.CANCEL,
    title: 'CANCEL',
    handler: cancelGame
  },
  {
    key: MenuBtn.VIEW_CONTRACTS,
    title: 'VIEW CONTRACTS',
    handler: viewContracts
  },
  {
    key: MenuBtn.DESTROY_CONTRACT,
    title: 'DESTROY',
    handler: destroyContract
  }
];
