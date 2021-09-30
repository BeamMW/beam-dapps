import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys, Routes } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import { Store } from '../../../logic/store/state_handler';

export class Lose extends BaseComponent {
  constructor(key = PopupKeys.LOSE) {
    super(Tags.DIV, [`popup__${key}`]);
    const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
    iconSVG.innerHTML = SVG.popupLose;
    const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
    titleText.element.textContent = 'BETTER LUCK NEXT TIME!';
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
      window.history.pushState({}, '', Routes.MAIN);
    });
    this.append(iconSVG, titleText, btn);
  }
}
