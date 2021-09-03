import {
  startGame, viewBoard
} from '../utils/request_creators';

export enum MenuBtn {
  NEW = 'NEW',
  CONTINUE = 'CONTINUE',
  OPTIONS = 'OPTIONS',
  CANCEL = 'CANCEL',
  VIEW_CONTRACTS = 'VIEW_CONTRACTS',
  DESTROY_CONTRACT = 'DESTROY_CONTRACT',
  RETURN = 'RETURN',
  BEST = 'BEST'
}

export enum RouterMode {
  HISTORY = 'history',
  HASH = 'hash'
}

export enum Routes {
  OPTIONS = 'options',
  RETURN = 'return',
  MAIN = '/',
  BEST = 'best'
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
      window.history.pushState({}, '', `/${Routes.OPTIONS}`);
    }
  },
  {
    key: MenuBtn.BEST,
    title: 'VIEW BEST',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.BEST}`);
    }
  },
  {
    key: MenuBtn.RETURN,
    title: 'RETURN TO MAIN',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.RETURN}`);
    }
  }
  // {
  //   key: MenuBtn.CANCEL,
  //   title: 'CANCEL',
  //   handler: cancelGame
  // }
  // {
  //   key: MenuBtn.VIEW_CONTRACTS,
  //   title: 'VIEW CONTRACTS',
  //   handler: viewContracts
  // },
  // {
  //   key: MenuBtn.DESTROY_CONTRACT,
  //   title: 'DESTROY',
  //   handler: destroyContract
  // }
];
