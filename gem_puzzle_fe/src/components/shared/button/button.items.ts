import { MenuButtonType } from 'ComponentProps';
import { SVG } from '../../../constants/svg.icons';
import {
  RC
} from '../../../logic/beam/request_creators';
import { MenuBtn, Routes } from '../../../constants/app';
import { Beam } from '../../../logic/beam/api_handler';
import playIcon from '../../../assets/icon/icon-new-game-copy-2.svg';
import donateIcon from '../../../assets/icon/icon-donate-copy.svg';
import beamIcon from '../../../assets/icon/icon-beam-copy-356.svg';

export const menuProps: MenuButtonType[] = [
  {
    key: MenuBtn.CONTINUE,
    icon: playIcon,
    title: 'PLAY',
    handler: ():void => {
      window.history.pushState({}, '', `/${Routes.PLAY}`);
    }
  },
  {
    key: MenuBtn.NEW,
    icon: beamIcon,
    title: 'NEW BET',
    handler: () => Beam.callApi(RC.startGame())
  },
  {
    key: MenuBtn.DONATE,
    icon: donateIcon,
    title: 'DONATE',
    handler: () => Beam.callApi(RC.viewPrizeFund())
  }
  // {
  //   key: MenuBtn.SET_ACTIVE,
  //   title: 'Active',
  //   handler: ():void => {
  //     // const active = Store.getState().info.isTx;
  //     Store.dispatch(AC.setPopup(PopupKeys.LIMIT));
  //   }
  // }
];

export const claimBtn = [
  {
    key: MenuBtn.CLAIM_REWARD,
    title: 'CLAIM REWARD',
    icon: SVG.buttonIcon,
    handler: ():void => Beam.callApi(RC.takePendingRewards())
  }
];
