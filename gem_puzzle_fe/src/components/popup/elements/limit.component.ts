import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/tags';
import BaseComponent from '../../base/base.component';
import { Store } from '../../../logic/store/state_handler';

export class Limit extends BaseComponent {
  constructor(key = PopupKeys.LOSE) {
    super(Tags.DIV, [`popup__${key}`]);
    Store.dispatch(AC.setGame({
      board: null,
      solution: []
    }));
    window.localStorage.removeItem('state');
    const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
    iconSVG.innerHTML = SVG.popupLose;
    const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
    titleText.element.textContent = 'MOVE LIMIT EXCEEDED!';
    const btn = new BaseComponent(Tags.DIV, [`popup__${key}_back`]);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    this.append(iconSVG, titleText, btn);
  }
}
