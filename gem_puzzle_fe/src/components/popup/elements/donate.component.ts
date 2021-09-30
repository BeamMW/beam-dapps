import { PopupKeys } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/html';
import { Beam } from '../../../logic/beam/api_handler';
import { RC } from '../../../logic/beam/request_creators';
import { AC } from '../../../logic/store/app_action_creators';
import { Store } from '../../../logic/store/state_handler';
import {
  handleString,
  parseToGroth
} from '../../../utils/string_handlers';
import BaseComponent from '../../base/base.component';

export class Donate extends BaseComponent {
  prizeFund: BaseComponent;

  inputValue = '1';

  constructor(data: number, key = PopupKeys.DONATE) {
    super(Tags.DIV, [`popup__${key}`]);
    const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
    iconSVG.innerHTML = SVG.popupLose;
    const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
    titleText.element.textContent = 'DONATE';
    const prizeWrap = new BaseComponent(Tags.DIV, [`popup__${key}_prizeWrap`]);
    this.prizeFund = new BaseComponent(Tags.SPAN, [`popup__${key}_prizeFund`]);
    const currencyFund = new BaseComponent(Tags.SPAN, [
      `popup__${key}_currencyFund`
    ]);
    currencyFund.element.textContent = 'FUNT';
    const amount = data;
    this.prizeFund.element.textContent = `PRIZE FUND ${amount}`;
    prizeWrap.append(this.prizeFund, currencyFund);
    const inputWrap = new BaseComponent(Tags.DIV, [`popup__${key}_inputWrap`]);
    const input = new BaseComponent(Tags.INPUT, [`popup__${key}_input`]);
    const currency = new BaseComponent(Tags.SPAN, [`popup__${key}_currency`]);
    currency.element.textContent = 'FUNT';
    const inputElement = input.element as HTMLInputElement;
    input.setAttributes({
      value: '1'
    });

    inputWrap.append(input, currency);
    const setDonate = new BaseComponent(Tags.DIV, [`popup__${key}_btn`]);
    setDonate.element.textContent = 'DONATE';
    setDonate.element.addEventListener('click', () => {
      const { isTx } = Store.getState().info;
      if (!isTx) {
        const beamToGroth = parseToGroth(Number(inputElement.value));
        Beam.callApi(RC.donate(Number(beamToGroth)));
        Store.dispatch(AC.setPopup(false));
      }
    });
    input.element.addEventListener('input', (e:Event) => {
      console.log(e);
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
      target.value = this.inputValue;
    });
    input.element.addEventListener('keydown', (e:KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      const check = e.key === 'Backspace'
        ? target.value.substring(0, target.value.length - 1)
        : target.value + e.key;
      const regex = new RegExp(/^-?\d+(\.\d*)?$/g);
      if ((!check.match(regex)
      || check.length > 10)
      && e.key !== 'Backspace') {
        e.preventDefault();
      } else if (handleString(check)) {
        this.inputValue = check;
        setDonate.classList.remove('disabled');
      } else {
        this.inputValue = check;
        setDonate.classList.add('disabled');
      }
    });
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    this.append(iconSVG, titleText, prizeWrap, inputWrap, setDonate, btn);
  }
}
