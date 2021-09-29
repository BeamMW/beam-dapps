import { IState } from 'AppStateProps';
import { Store } from '../../logic/store/state_handler';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import './header.scss';
import InfoBLock from '../shared/header_info/header.info.component';
import { RC } from '../../logic/beam/request_creators';
import { Beam } from '../../logic/beam/api_handler';
import { parseToBeam } from '../../utils/string_handlers';
import { SVG } from '../../constants/svg.icons';

export default class Header extends BaseComponent {
  private readonly rewardBlock: BaseComponent;

  private readonly headerTop: BaseComponent;

  reward = 0;

  constructor() {
    super(Tags.DIV, ['header']);
    Store.addObservers(this);
    this.headerTop = new BaseComponent(Tags.DIV, ['header__top']);
    this.rewardBlock = new BaseComponent(Tags.DIV, ['infoblock']);
    this.rewardBlock.element.addEventListener('click', () => {
      const { isTx } = Store.getState().info;
      this.reward = Store.getState().info.pending_rewards;
      if (!isTx && this.reward > 0) {
        Beam.callApi(RC.takePendingRewards());
      }
    });
    this.initHeader();
  }

  initHeader = (): void => {
    const logoBlock = new InfoBLock({
      key: 'logo',
      title: SVG.logoGemPuzzleBig,
      value: '',
      after: 'GEM-PUZZLE',
      before: ' '
    });
    this.headerTop.append(logoBlock);
    this.rewardBlock.element.innerHTML = `
    ${SVG.funt} <span> ${this.reward} FUNT</span>
    `;
    this.headerTop.append(this.rewardBlock);
    this.append(this.headerTop);
  };

  appInform = (state: IState): void => {
    const reward = state.info.pending_rewards;
    if (reward !== this.reward) {
      this.reward = reward;
      const num = Number(parseToBeam(reward))
        .toFixed(8)
        .replace(/\.?0+$/, '');
      this.rewardBlock.element.innerHTML = this.reward
        ? `
      ${SVG.funt} <span> CLAIM ${num} FUNT</span>`
        : `<span> ${num} FUNT</span>`;
      if (reward) {
        this.rewardBlock.classList.add('active');
      } else this.rewardBlock.classList.remove('active');
    }
  };
}
