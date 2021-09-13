import { AppStateHandler } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './header.scss';
// import { boardSchemeMaker } from '../../utils/string_handlers';
import InfoBLock from './infoblock.component';
import iconFunt from '../../assets/icon/icon-funts-coins-stack.svg';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const {
      reward
    } = AppStateHandler.getState();
    const rewardBlock = new InfoBLock({
      key: 'reward',
      title: `<svg width="34" height="31" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
          <path fill="#008A36" d="M16.982.5 4.324 22.377 16.982 30.5l12.657-8.123z"/>
          <path fill="#00FF64" d="M16.982.5 4.324 22.377l12.658 1.434 12.657-1.434z"/>
          <path fill="#00BF4A" d="m16.982.5 12.987 7.35-.33 14.527z"/>
          <path fill="#00BF4A" d="M16.987.5 4 7.85l.33 14.527z"/>
      </g>
  </svg>`,
      value: reward,
      after: 'FUNT'
    });
    const logoBlock = new InfoBLock({
      key: 'logo',
      title: `<svg width="34" height="31" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
          <path fill="#008A36" d="M16.982.5 4.324 22.377 16.982 30.5l12.657-8.123z"/>
          <path fill="#00FF64" d="M16.982.5 4.324 22.377l12.658 1.434 12.657-1.434z"/>
          <path fill="#00BF4A" d="m16.982.5 12.987 7.35-.33 14.527z"/>
          <path fill="#00BF4A" d="M16.987.5 4 7.85l.33 14.527z"/>
      </g>
  </svg>`,
      value: ' ',
      after: 'GEM-PUZLLE'
    });
    this.append(
      logoBlock,
      rewardBlock
    );
  }
}
