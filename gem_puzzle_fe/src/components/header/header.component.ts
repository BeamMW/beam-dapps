import { IAppState } from 'AppStateProps';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './header.scss';
import InfoBLock from './infoblock.component';
import Greeting from '../greeting/greeting.component';
import { GrState } from '../greeting/greeting_state';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { takePendingRewards } from '../../logic/beam_api/request_creators';
import { SVG } from '../../assets/svg';

export default class Header extends BaseComponent {
  greeting: Greeting;

  private readonly rewardBlock: BaseComponent;

  private readonly headerTop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['header']);
    AppStateHandler.addObservers(this);
    this.greeting = new Greeting(GrState.MainTitle);
    this.headerTop = new BaseComponent(Tags.DIV, ['header__top']);
    this.rewardBlock = new BaseComponent(Tags.DIV, ['infoblock']);
    this.rewardBlock.element.addEventListener('click', () => {
      const { reward } = AppStateHandler.getState();
      console.log(reward);
      if (reward > 0) {
        takePendingRewards();
      }
    });
    this.initHeader();
  }

  initHeader = (): void => {
    const { reward } = AppStateHandler.getState();
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
    this.rewardBlock.style.cursor = 'default';
    this.headerTop.append(this.rewardBlock);
    this.append(this.headerTop, this.greeting);
  };

  appInform = ({ reward }: IAppState): void => {
    if (reward > 0) {
      this.rewardBlock.element.innerHTML = `
      ${SVG.funt} <span> CLAIM ${reward} FUNT</span>
      `;
      // this.rewardBlock.style.backgroundsv = ${SVG.claimBtn}`;
      // this.rewardBlock.element.addEventListener('click', () => {
      //   takePendingRewards();
      // });
    } else {
      this.rewardBlock.element.innerHTML = `
      ${SVG.funt} <span> ${reward} FUNT</span>
      `;
      this.rewardBlock.style.cursor = 'default';
    }
  };
}
