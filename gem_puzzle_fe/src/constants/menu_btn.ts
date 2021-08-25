import { startGame } from '../utils/request_creators';

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
    title: 'Options',
    handler: startGame
  },
  {
    key: MenuBtn.EXIT,
    title: 'Exit',
    handler: startGame
  }
];
