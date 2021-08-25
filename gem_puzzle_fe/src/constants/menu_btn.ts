import { startGame, exit } from '../utils/request_creators';

export enum MenuBtn {
  NEW = 'NEW',
  // CONTINUE = 'CONTINUE',
  EXIT = 'EXIT'
}

export const menuBtn = [
  {
    key: MenuBtn.NEW,
    title: 'New Game',
    handler: startGame
  },
  // {
  //   key: MenuBtn.CONTINUE,
  //   title: 'Continue',
  //   handler: Continue
  // },
  {
    key: MenuBtn.EXIT,
    title: 'Exit',
    handler: exit
  }
];
