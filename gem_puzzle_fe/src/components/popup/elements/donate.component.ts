import { IState } from 'AppStateProps';
import { PopupKeys } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/tags';
import { Beam } from '../../../logic/beam/api_handler';
import { RC } from '../../../logic/beam/request_creators';
import { AC } from '../../../logic/store/app_action_creators';
import { Store } from '../../../logic/store/state_handler';
import { handleString, parseToBeam, parseToGroth } from '../../../utils/string_handlers';
import BaseComponent from '../../base/base.component';

export class Donate extends BaseComponent {
  prizeFund: BaseComponent;

  constructor(key = PopupKeys.DONATE) {
    super(Tags.DIV, [`popup__${key}`]);
    Store.addObservers(this);
    const prizeAmount = Store.getState().info.prizeFund;
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
    const amount = Number(parseToBeam(prizeAmount));
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
      const beamToGroth = parseToGroth(Number(inputElement.value));
      Beam.callApi(RC.donate(Number(beamToGroth)));
      Store.dispatch(AC.setPopup(false));
    });
    input.element.oninput = function () {
      if (
        inputElement.value === ''
        || inputElement.value === '0'
        || inputElement.value === '0'
        || inputElement.value === '0.'
        || inputElement.value === '0.0'
        || inputElement.value > '100'
        // || !handleString(inputElement.value)
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
    this.append(iconSVG, titleText, prizeWrap, inputWrap, setDonate, btn);
  }

  appInform = (state: IState): void => {
    const prizeAmount = state.info.prizeFund;
    const amount = Number(parseToBeam(prizeAmount));
      this.prizeFund.element.textContent = `PRIZE FUND ${amount}`;
  };
}
