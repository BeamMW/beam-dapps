import { SVG } from './svg.icons';
import {
  cancelGame,
  startGame,
  takePendingRewards
} from '../logic/beam_api/request_creators';
import { MenuBtn, Routes } from './app_constants';

export const menuProps = [
  {
    key: MenuBtn.CONTINUE,
    title: 'CONTINUE',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.PLAY}`);
    }
  },
  {
    key: MenuBtn.NEW,
    icon: `${SVG.newGameIcon}`,
    title: 'NEW GAME',
    handler: startGame
  },
  {
    key: MenuBtn.BEST,
    icon: `${SVG.leaderboardIcon}`,
    title: 'LEADERBOARD',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.BEST}`);
    }
  },
  {
    key: MenuBtn.OPTIONS,
    icon: `${SVG.settingIcon}`,
    title: 'SETTING',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.OPTIONS}`);
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
  }
];

export const claimBtn = [
  {
    key: MenuBtn.CLAIM_REWARD,
    title: 'CLAIM REWARD',
    icon: SVG.buttonIcon,
    handler: takePendingRewards
  }
];
