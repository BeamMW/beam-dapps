import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './win.scss';

export class Win extends BaseComponent {
  [x: string]: any;

  constructor() {
    super(Tags.DIV, ['winner']);
    this.initWinnerPopUp();
  }

  initWinnerPopUp = ():void => {
    this.removeAll();
    const winLabel = new BaseComponent(Tags.H1, ['winLabel']);
    winLabel.element.textContent = 'You WON';
    this.append(winLabel);
  };
}
