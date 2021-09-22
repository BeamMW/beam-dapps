import { IAppState } from 'AppStateProps';
import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Button from '../shared/button/button.component';
import './menu.scss';
import { MenuBtn } from '../../constants/app_constants';
import { menuProps } from '../../constants/menu_btn';
import { Store } from '../../logic/app_state/state_handler';
import Greeting from '../greeting/greeting.component';

export default class Menu extends BaseComponent {
  greeting: Greeting;

  buttons: Map<MenuBtn, Button>;

  constructor() {
    super(Tags.DIV, ['menu']);
    Store.addObservers(this);
    // this.desc = new BaseComponent(Tags.SPAN, ['desc']);
    // this.desc.innerHTML = 'Play and earn!';
    this.greeting = new Greeting();
    this.buttons = new Map();
    menuProps.forEach((btn) => {
      this.buttons.set(btn.key, this.buttonBuilder(btn));
    });
    const values = this.buttons.values();
    this.append(this.greeting, ...values);
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
    this.greeting.element.style.display = 'flex';
  };

  addActive = (): void => {
    this.classList.add('active');
    this.buttons.forEach((value, key) => {
      value.setDisplay = key === MenuBtn.RETURN;
    });
    this.greeting.element.style.display = 'none';
  };

  inform = (res:APIResponse):void => {
    switch (res.id) {
      default:
        break;
    }
  };

  appInform = ({ activeGame, isTx }: IAppState): void => {
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
