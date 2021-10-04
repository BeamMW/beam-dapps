import { IState } from 'AppStateProps';
import { AppSpecs } from '../../../constants/api';
import { HtmlTexts, Tags } from '../../../constants/html';
import { Store } from '../../../logic/store/state_handler';
import { parseToBeam } from '../../../utils/string_handlers';
import BaseComponent from '../../base/base.component';
import './greeting.scss';

export default class Greeting extends BaseComponent {
  descDom: BaseComponent;

  max_bet: number;

  visible = false;

  asset_name = <string>AppSpecs.DEFAULT_ASSET;

  constructor() {
    super(Tags.DIV, ['description']);
    Store.addObservers(this);
    this.max_bet = 0;
    const titleDom = new BaseComponent(Tags.SPAN, ['title']);
    titleDom.innerHTML = HtmlTexts.MAIN_TITLE;
    this.descDom = new BaseComponent(Tags.SPAN, ['desc']);
    this.descDom.innerHTML = HtmlTexts.MAIN_DESC;
    this.style.visibility = 'hidden';
    this.append(titleDom, this.descDom);
  }

  appInform = (state: IState):void => {
    if (this.max_bet !== state.cid.max_bet
      || this.asset_name !== state.info.asset_name
    ) {
      this.max_bet = state.cid.max_bet;
      this.asset_name = state.info.asset.name;
      this.descDom.style.color = state.info.asset.color || '#fff';
      this.descDom.innerHTML = this.max_bet > 0
        ? `Current Bet: ${Number(parseToBeam(this.max_bet)).toFixed(8)
          .replace(/\.?0+$/, '')} ${this.asset_name}`
        : HtmlTexts.MAIN_DESC;
    }
    if (!this.visible) {
      this.visible = true;
      this.style.visibility = 'visible';
    }
  };
}
