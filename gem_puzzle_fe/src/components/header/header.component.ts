import { IAppState } from 'AppStateProps';
import { Store } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './header.scss';
import InfoBLock from './infoblock.component';
import { RC } from '../../logic/beam_api/request_creators';
import { SVG } from '../../constants/svg.icons';
import Greeting from '../greeting/greeting.component';
import { GrState } from '../greeting/greeting_state';
import { Beam } from '../../logic/beam_api/api_handler';

export default class Header extends BaseComponent {
  private readonly rewardBlock: BaseComponent;

  private readonly headerTop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['header']);
    Store.addObservers(this);
    this.headerTop = new BaseComponent(Tags.DIV, ['header__top']);
    this.rewardBlock = new BaseComponent(Tags.DIV, ['infoblock']);
    this.rewardBlock.element.addEventListener('click', () => {
      const { reward } = Store.getState();
      console.log(reward);
      if (reward > 0) {
        Beam.callApi(RC.takePendingRewards());
      }
    });
    this.initHeader();
  }

  initHeader = (): void => {
    const { reward } = Store.getState();
    const logoBlock = new InfoBLock({
      key: 'logo',
      title: SVG.logoGemPuzzleBig,
      value: '',
      after: 'GEM-PUZZLE',
      before: ' '
    });
    this.headerTop.append(logoBlock);
    this.rewardBlock.element.innerHTML = `
    ${SVG.funt} <span> ${reward} FUNT</span>
    `;
    this.headerTop.append(this.rewardBlock);
    this.append(this.headerTop);
  };

  appInform = ({ reward }: IAppState): void => {
    if (reward !== 0) {
      this.rewardBlock.element.innerHTML = `
      ${SVG.funt} <span> CLAIM ${reward} FUNT</span>
      `;
      this.rewardBlock.classList.add('active');
    }
  };
}
