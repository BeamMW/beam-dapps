import { MenuButtonType } from 'ComponentProps';
import { SVG } from './svg.icons';
import {
  RC
} from '../logic/beam/request_creators';
import { MenuBtn, Routes } from './app';
import { Beam } from '../logic/beam/api_handler';

export const menuProps: MenuButtonType[] = [
  {
    key: MenuBtn.CONTINUE,
    title: 'PLAY',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.PLAY}`);
    }
  },
  {
    key: MenuBtn.NEW,
    icon: `${SVG.newGameIcon}`,
    title: 'NEW GAME',
    handler: () => Beam.callApi(RC.startGame())
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
    handler: () => Beam.callApi(RC.cancelGame())
  },
  {
    key: MenuBtn.DONATE,
    title: 'DONATE FOR FOUND',
    handler: () => Beam.callApi(RC.donate())
  }
];

export const claimBtn = [
  {
    key: MenuBtn.CLAIM_REWARD,
    title: 'CLAIM REWARD',
    icon: SVG.buttonIcon,
    handler: ():void => Beam.callApi(RC.takePendingRewards())
  }
];
