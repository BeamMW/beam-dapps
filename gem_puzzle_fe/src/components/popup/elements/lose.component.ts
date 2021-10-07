import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys, Routes } from '../../../constants/app';
import headIcon from '../../../assets/icon/il-luck-next-time.svg';
import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import { Store } from '../../../logic/store/state_handler';

export class Lose extends BaseComponent {
  constructor(key = PopupKeys.LOSE) {
    super(Tags.DIV, [`popup__${key}`]);
    const container = new BaseComponent(Tags.DIV, ['popup-content']);
    const iconSVG = new BaseComponent(
      Tags.IMG, ['popup-icon']
    );
    iconSVG.setAttributes({
      src: headIcon
    });
    const titleText = new BaseComponent(
      Tags.SPAN, [`popup__${key}_text`, 'popup-title']
    );
    titleText.innerHTML = 'BETTER LUCK NEXT TIME!';
    const btnBlock = new BaseComponent(Tags.DIV, ['popup-btn_block']);
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.innerHTML = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
      window.history.pushState({}, '', Routes.MAIN);
    });
    btnBlock.append(btn);
    container.append(iconSVG, titleText);
    this.append(container, btnBlock);
  }
}
