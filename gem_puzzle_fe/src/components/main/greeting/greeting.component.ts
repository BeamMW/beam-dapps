import { IState } from 'AppStateProps';
import { GreetingsText } from '../../../constants/app';
import { Tags } from '../../../constants/tags';
import { Store } from '../../../logic/store/state_handler';
import { parseToBeam } from '../../../utils/string_handlers';
import BaseComponent from '../../base/base.component';
import './greeting.scss';

export default class Greeting extends BaseComponent {
  descDom: BaseComponent;

  max_bet: number;

  constructor() {
    super(Tags.DIV, ['description']);
    Store.addObservers(this);
    this.max_bet = 0;
    const titleDom = new BaseComponent(Tags.SPAN, ['title']);
    titleDom.innerHTML = GreetingsText.MainTitle;
    this.descDom = new BaseComponent(Tags.SPAN, ['desc']);
    this.append(titleDom, this.descDom);
  }

  appInform = (state: IState):void => {
    if (this.max_bet !== state.cid.max_bet) {
      this.max_bet = state.cid.max_bet;
      this.descDom.innerHTML = this.max_bet > 0
        ? `Current Bet: ${Number(parseToBeam(this.max_bet)).toFixed(8)
          .replace(/\.?0+$/, '')} BEAM`
        : GreetingsText.MainDesc;
    }
  };
}
