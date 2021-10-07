import { IState } from 'AppStateProps';
import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import Button from '../../shared/button/button.component';
import './menu.scss';
import Greeting from '../greeting/greeting.component';
import { MenuBtn } from '../../../constants/app';
import { Store } from '../../../logic/store/state_handler';
import { menuProps } from '../../shared/button/button.items';

export default class Menu extends BaseComponent {
  greeting: Greeting;

  buttons: Map<MenuBtn, Button>;

  constructor() {
    super(Tags.DIV, ['menu']);
    Store.addObservers(this);
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

  appInform = (state: IState): void => {
    const { isTx } = state.info;
    const activeGame = state.info.has_active_game;
    const bet = Store.getState().cid.max_bet;
    if (!this.classList.contains('active')) {
      if (isTx) {
        this.getBtn(MenuBtn.NEW).setDisplay = false;
        this.getBtn(MenuBtn.CONTINUE).setDisplay = false;
      } else if (bet) {
        this.getBtn(MenuBtn.NEW).setDisplay = true;
        this.getBtn(MenuBtn.CONTINUE).setDisplay = Boolean(activeGame);
      } else {
        this.getBtn(MenuBtn.CONTINUE).setDisplay = true;
      }
      // this.getBtn(MenuBtn.SET_ACTIVE).setDisplay = true;
      this.getBtn(MenuBtn.DONATE).setDisplay = true;
    }
  };
}
