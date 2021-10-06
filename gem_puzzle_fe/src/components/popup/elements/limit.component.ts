import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys } from '../../../constants/app';
import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import { Store } from '../../../logic/store/state_handler';
import headIcon from '../../../assets/icon/il-luck-next-time.svg';

export class Limit extends BaseComponent {
  constructor(key = PopupKeys.LOSE) {
    super(Tags.DIV, [`popup__${key}`]);
    Store.dispatch(AC.setGame({
      board: null,
      solution: []
    }));
    window.localStorage.removeItem('state');
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
    titleText.innerHTML = 'MOVE LIMIT EXCEEDED!';
    const btnBlock = new BaseComponent(Tags.DIV, ['popup-btn_block']);
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.innerHTML = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    btnBlock.append(btn);
    container.append(iconSVG, titleText);
    this.append(container, btnBlock);
  }
}
