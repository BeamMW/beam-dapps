import { IState } from 'AppStateProps';
import { Store } from '../../logic/store/state_handler';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import './header.scss';
import InfoBLock from '../shared/header_info/header.info.component';
import { RC } from '../../logic/beam/request_creators';
import Greeting from '../greeting/greeting.component';
import { GrState } from '../greeting/greeting_state';
import { Beam } from '../../logic/beam/api_handler';
import { parseToBeam } from '../../utils/string_handlers';
import { SVG } from '../../constants/svg.icons';

export default class Header extends BaseComponent {
  greeting: Greeting;

  private readonly rewardBlock: BaseComponent;

  private readonly headerTop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['header']);
    Store.addObservers(this);
    this.greeting = new Greeting(GrState.MainTitle);
    this.headerTop = new BaseComponent(Tags.DIV, ['header__top']);
    this.rewardBlock = new BaseComponent(Tags.DIV, ['infoblock']);
    this.rewardBlock.element.addEventListener('click', () => {
      const { reward } = Store.getState().info;
      if (reward > 0) {
        Beam.callApi(RC.takePendingRewards());
      }
    });
    this.initHeader();
  }

  initHeader = (): void => {
    const { reward } = Store.getState().info;
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
    this.append(this.headerTop, this.greeting);
  };

  appInform = (state: IState): void => {
    const { reward } = state.info;
    if (reward !== 0) {
      this.rewardBlock.element.innerHTML = `
      ${SVG.funt} <span> CLAIM ${parseToBeam(reward)} FUNT</span>
      `;
      this.rewardBlock.classList.add('active');
    }
  };
}
