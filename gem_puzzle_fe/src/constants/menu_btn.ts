import { startGame, viewBoard, exit } from '../utils/request_creators';

export enum MenuBtn {
  NEW = 'NEW',
  OPTIONS = 'OPTIONS',
  EXIT = 'EXIT'
}

export const menuBtn = [
  {
    key: MenuBtn.NEW,
    title: 'New Game',
    handler: startGame
  },
  {
    key: MenuBtn.OPTIONS,
    title: 'View Board',
    handler: viewBoard
  },
  {
    key: MenuBtn.EXIT,
    title: 'Exit',
    handler: exit
  }
];
