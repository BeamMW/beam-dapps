import { PopupKeys } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/tags';
import { AC } from '../../../logic/store/app_action_creators';
import { Store } from '../../../logic/store/state_handler';
import { handleString } from '../../../utils/string_handlers';
import BaseComponent from '../../base/base.component';

export class Donate extends BaseComponent {
  constructor(key = PopupKeys.DONATE) {
    super(Tags.DIV, [`popup__${key}`]);
    const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
    iconSVG.innerHTML = SVG.popupLose;
    const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
    titleText.element.textContent = 'DONATE';
    const inputWrap = new BaseComponent(Tags.DIV, [`popup__${key}_inputWrap`]);
    const input = new BaseComponent(Tags.INPUT, [`popup__${key}_input`]);
    input.setAttributes({
      value: '0.1'
    });
    const currency = new BaseComponent(Tags.SPAN, [`popup__${key}_currency`]);
    currency.element.textContent = 'FUNT';
    inputWrap.append(input, currency);
    const setDonate = new BaseComponent(Tags.DIV, [`popup__${key}_btn`]);
    setDonate.element.textContent = 'DONATE';
    setDonate.element.addEventListener('click', () => {
      console.log('donate');
    });
    const inputElement = input.element as HTMLInputElement;
    input.element.oninput = function () {
      if (
        inputElement.value === ''
        || inputElement.value === '0'
        || inputElement.value === '0'
        || inputElement.value === '0.'
        || inputElement.value > '100'
        || !handleString(inputElement.value)
      ) {
        setDonate.element.classList.add('disabled');
      } else {
        setDonate.element.classList.remove('disabled');
      }
    };
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    this.append(iconSVG, titleText, inputWrap, setDonate, btn);
  }
}
