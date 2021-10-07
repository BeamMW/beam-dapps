import { IState } from 'AppStateProps';
import { Store } from '../../logic/store/state_handler';
import { Tags } from '../../constants/html';
import BaseComponent from '../base/base.component';
import './header.scss';
import InfoBLock from '../shared/header_info/header.info.component';
import { RC } from '../../logic/beam/request_creators';
import { Beam } from '../../logic/beam/api_handler';
import { parseToBeam } from '../../utils/string_handlers';
import { SVG } from '../../constants/svg.icons';
import { AppSpecs } from '../../constants/api';

export default class Header extends BaseComponent {
  private readonly rewardBlock: BaseComponent;

  private readonly headerTop: BaseComponent;

  reward = 0;

  asset = <string>AppSpecs.DEFAULT_ASSET;

  visible = false;

  constructor() {
    super(Tags.DIV, ['header']);
    Store.addObservers(this);
    this.headerTop = new BaseComponent(Tags.DIV, ['header__top']);
    this.rewardBlock = new BaseComponent(Tags.DIV, ['infoblock', 'reward']);
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
    ${SVG.funt} <span> ${this.reward} ${this.asset}</span>
    `;
    this.headerTop.append(this.rewardBlock);
    this.append(this.headerTop);
  };

  appInform = (state: IState): void => {
    const reward = state.info.pending_rewards;
    const { asset } = state.info;
    if (reward !== this.reward || asset.name !== this.asset) {
      this.reward = reward;
      this.asset = asset.name;
      const num = Number(parseToBeam(reward))
        .toFixed(8)
        .replace(/\.?0+$/, '');
      this.rewardBlock.innerHTML = this.reward
        ? `${SVG.funt} <span> CLAIM ${num} ${this.asset}</span>`
        : `${SVG.funt} <span> ${num} ${this.asset}</span>`;
      if (reward) {
        this.rewardBlock.classList.add('active');
      } else this.rewardBlock.classList.remove('active');
    }
  };
}
