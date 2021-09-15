import { AppStateHandler } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './header.scss';
// import { boardSchemeMaker } from '../../utils/string_handlers';
import InfoBLock from './infoblock.component';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const { reward } = AppStateHandler.getState();
    const logoBlock = new InfoBLock({
      key: 'logo',
      title: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
      <path d="M35.714 0A4.286 4.286 0 0 1 40 4.286v31.428A4.286 4.286 0 0 1 35.714 40H4.286A4.286 4.286 0 0 1 0 35.714V4.286A4.286 4.286 0 0 1 4.286 0h31.428zm0 2.143H4.286c-1.114 0-2.03.85-2.133 1.936l-.01.207v31.428c0 1.114.85 2.03 1.936 2.133l.207.01h31.428c1.114 0 2.03-.85 2.133-1.936l.01-.207V4.286c0-1.114-.85-2.03-1.936-2.133l-.207-.01z" fill="#00FF64" fill-rule="nonzero"/>
      <path d="M33.12 0A2.88 2.88 0 0 1 36 2.88v30.24A2.88 2.88 0 0 1 33.12 36H2.88A2.88 2.88 0 0 1 0 33.12V2.88A2.88 2.88 0 0 1 2.88 0h30.24zm0 2.16H2.88a.72.72 0 0 0-.708.59l-.012.13v30.24a.72.72 0 0 0 .59.708l.13.012h30.24a.72.72 0 0 0 .708-.59l.012-.13V2.88a.72.72 0 0 0-.59-.708l-.13-.012z" fill="#00FF64" fill-rule="nonzero"/>
      <rect stroke="#00FF64" stroke-width="2" fill="#00FF64" x="5" y="20" width="11" height="11" rx="2"/>
      <rect stroke="#00FF64" stroke-width="2" fill="#00FF64" x="20" y="20" width="11" height="11" rx="2"/>
      <rect stroke="#FAFF7A" stroke-width="2" fill="#FAFF7A" x="20" y="5" width="11" height="11" rx="2"/>
      </g>
      </svg>
      `,
      value: '',
      after: 'GEM-PUZZLE',
      before: ' '
    });
    this.append(logoBlock);
    if (reward !== 0) {
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
        after: 'FUNT',
        before: ' '
      });
      this.append(rewardBlock);
    } else {
      const rewardBlock = new InfoBLock({
        key: 'reward',
        title: ` <svg width="34" height="31" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <path fill="#008A36" d="M16.982.5 4.324 22.377 16.982 30.5l12.657-8.123z"/>
        <path fill="#00FF64" d="M16.982.5 4.324 22.377l12.658 1.434 12.657-1.434z"/>
        <path fill="#00BF4A" d="m16.982.5 12.987 7.35-.33 14.527z"/>
        <path fill="#00BF4A" d="M16.987.5 4 7.85l.33 14.527z"/>
    </g>
</svg> `,
        value: reward,
        before: 'CLAIM ',
        after: ' FUNT'
      });
      this.append(rewardBlock);
    }
  }
}
