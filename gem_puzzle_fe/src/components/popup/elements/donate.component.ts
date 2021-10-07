import { MenuBtn, PopupKeys } from '../../../constants/app';
import imgTitle from '../../../assets/icon/il-giveaway-started.svg';
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
import gemIcon from '../../../assets/icon/icon-funts-coins-stack.svg';
import Button from '../../shared/button/button.component';
import donateIcon from '../../../assets/icon/icon-donate-copy.svg';
import backIcon from '../../../assets/icon/icon-back-to-game.svg';

export class Donate extends BaseComponent {
  prizeFund: BaseComponent;

  inputValue = '1';

  constructor(data: number, key = PopupKeys.DONATE) {
    super(Tags.DIV, [`popup__${key}`]);
    const { asset } = Store.getState().info;
    const contentWrapper = new BaseComponent(Tags.DIV, ['popup-content']);
    const buttonBlock = new BaseComponent(Tags.DIV, ['popup-btn_block']);
    const iconSVG = new BaseComponent(
      Tags.IMG, [`popup__${key}_icon`, 'popup-icon']
    );
    iconSVG.setAttributes({
      src: imgTitle
    });
    const titleText = new BaseComponent(
      Tags.SPAN, [`popup__${key}_text`, 'popup-title']
    );
    titleText.innerHTML = 'DONATE';
    const prizeWrap = new BaseComponent(Tags.DIV, [`popup__${key}_prizeWrap`]);
    this.prizeFund = new BaseComponent(Tags.SPAN, [`popup__${key}_prizeFund`]);
    const currencyFund = new BaseComponent(Tags.SPAN, [
      `popup__${key}_currencyFund`
    ]);
    currencyFund.innerHTML = asset.name;
    const amount = data;
    const spanFund = new BaseComponent(Tags.SPAN);
    spanFund.innerHTML = 'PRIZE FUND: ';
    this.prizeFund.innerHTML = `${amount}`;
    prizeWrap.append(spanFund, this.prizeFund, currencyFund);
    const inputWrap = new BaseComponent(Tags.DIV, [`popup__${key}_inputWrap`]);
    const input = new BaseComponent(Tags.INPUT, [`popup__${key}_input`]);
    const iconWrapper = new BaseComponent(
      Tags.DIV, [`popup__${key}_iconWrapper`]
    );
    const currency = new BaseComponent(Tags.SPAN, [`popup__${key}_currency`]);
    currency.innerHTML = asset.name;
    const inputElement = input.element as HTMLInputElement;
    input.setAttributes({
      value: '1'
    });
    const iconCurrency = new BaseComponent(Tags.IMG, [
      `popup__${key}_iconCurrency`]);
    iconCurrency.setAttributes({
      src: gemIcon
    });
    iconWrapper.append(iconCurrency, currency);
    inputWrap.append(input, iconWrapper);
    const setDonate = new Button({
      key: MenuBtn.DONATE,
      icon: donateIcon,
      title: 'PROCEED'
    });
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
    const orText = new BaseComponent(Tags.DIV, ['or-text']);
    orText.innerHTML = 'or';
    const btn = new Button({
      key: MenuBtn.RETURN_DONATE,
      icon: backIcon,
      title: 'BACK TO MAIN SCREEN'
    });

    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    contentWrapper.append(iconSVG, titleText, inputWrap, prizeWrap);
    buttonBlock.append(setDonate, orText, btn);
    this.append(contentWrapper, buttonBlock);
  }
}
