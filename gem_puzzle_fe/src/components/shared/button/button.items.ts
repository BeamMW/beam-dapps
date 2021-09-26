import { MenuButtonType } from 'ComponentProps';
import { SVG } from '../../../constants/svg.icons';
import {
  RC
} from '../../../logic/beam/request_creators';
import { MenuBtn, Routes } from '../../../constants/app';
import { Beam } from '../../../logic/beam/api_handler';

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
    icon: SVG.newGameIcon,
    title: 'NEW BET',
    handler: () => Beam.callApi(RC.startGame())
  },
  {
    key: MenuBtn.OPTIONS,
    icon: SVG.settingIcon,
    title: 'SETTING',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.OPTIONS}`);
    }
  },
  {
    key: MenuBtn.RETURN,
    title: 'CANCEL GAME',
    icon: SVG.iconCancel,
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.RETURN}`);
    }
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
