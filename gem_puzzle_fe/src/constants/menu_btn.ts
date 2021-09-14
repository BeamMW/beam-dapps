import {
  takePendingRewards,
  cancelGame,
  startGame, viewBoard
} from '../logic/beam_api/request_creators';
import { MenuBtn, Routes } from './app_constants';

export const menuProps = [
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
  },
  {
    key: MenuBtn.CANCEL,
    title: 'CANCEL GAME',
    handler: cancelGame
  },
  {
    key: MenuBtn.TAKE_REWARD,
    title: 'TAKE REWARD',
    handler: takePendingRewards
  }
];
