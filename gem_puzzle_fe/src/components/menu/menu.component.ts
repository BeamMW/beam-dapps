import { IState } from 'AppStateProps';
import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import Button from '../shared/button/button.component';
import './menu.scss';
import { MenuBtn } from '../../constants/app';
import { menuProps } from '../../constants/buttons';
import { Store } from '../../logic/store/state_handler';

export default class Menu extends BaseComponent {
  desc: BaseComponent;

  buttons: Map<MenuBtn, Button>;

  constructor() {
    super(Tags.DIV, ['menu']);
    Store.addObservers(this);
    this.desc = new BaseComponent(Tags.SPAN, ['desc']);
    this.desc.innerHTML = 'Play and earn!';
    this.buttons = new Map();
    menuProps.forEach((btn) => {
      this.buttons.set(btn.key, this.buttonBuilder(btn));
    });
    const values = this.buttons.values();
    this.append(this.desc, ...values);
  }

  buttonBuilder = (btn: typeof menuProps[number]):Button => {
    const btnKey = new Button(btn);
    return btnKey;
  };

  getBtn = (btn:MenuBtn):Button => this.buttons.get(btn) as Button;

  removeActive = (): void => {
    this.classList.remove('active');
    this.buttons.forEach((value) => {
      value.setDisplay = false;
    });
    this.desc.style.display = 'block';
  };

  addActive = (): void => {
    this.classList.add('active');
    this.buttons.forEach((value, key) => {
      value.setDisplay = key === MenuBtn.RETURN;
    });
    this.desc.style.display = 'none';
  };

  inform = (res:APIResponse):void => {
    switch (res.id) {
      default:
        break;
    }
  };

  appInform = (state: IState): void => {
    const { activeGame, isTx } = state.info;
    if (!this.classList.contains('active')) {
      if (isTx) {
        this.getBtn(MenuBtn.NEW).setDisplay = false;
        this.getBtn(MenuBtn.CANCEL).setDisplay = false;
        this.getBtn(MenuBtn.CONTINUE).setDisplay = false;
      } else {
        this.getBtn(MenuBtn.NEW).setDisplay = !activeGame;
        this.getBtn(MenuBtn.CANCEL).setDisplay = activeGame;
        this.getBtn(MenuBtn.CONTINUE).setDisplay = activeGame;
      }
      this.getBtn(MenuBtn.OPTIONS).setDisplay = true;
      this.getBtn(MenuBtn.BEST).setDisplay = true;
    }
  };
}
