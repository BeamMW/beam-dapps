import { IState } from 'AppStateProps';
import { GameInfoCb, GameInfoParams } from 'ComponentProps';
import { Tags } from '../../../constants/tags';
import { Store } from '../../../logic/store/state_handler';
import BaseComponent from '../../base/base.component';
import './game.info.scss';

export class GameInfo extends BaseComponent {
  valueDOM : BaseComponent;

  callback: (state: IState) => GameInfoCb;

  constructor({ icon, title, callback }:GameInfoParams) {
    super(Tags.DIV, ['game-info']);
    Store.addObservers(this);
    const titleDOM = new BaseComponent(Tags.SPAN);
    const iconDOM = new BaseComponent(Tags.IMG);
    this.valueDOM = new BaseComponent(Tags.SPAN, ['value']);
    titleDOM.innerHTML = title;
    iconDOM.setAttributes({
      src: icon
    });
    this.callback = callback;
    this.append(iconDOM, titleDOM, this.valueDOM);
  }

  appInform = (state: IState):void => {
    const params = this.callback(state);
    if (!params.result) {
      this.removeAll();
    } else this.valueDOM.innerHTML = params.value;
    if (params.color) this.valueDOM.style.color = params.color;
  };
}
