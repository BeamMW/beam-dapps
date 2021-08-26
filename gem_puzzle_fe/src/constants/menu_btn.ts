import { startGame, viewBoard } from '../utils/request_creators';

export enum MenuBtn {
  NEW = 'NEW',
  CONTINUE = 'CONTINUE',
  OPTIONS = 'OPTIONS'
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
  }
];
