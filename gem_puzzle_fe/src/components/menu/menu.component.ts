import { IAppState } from 'AppStateProps';
import { APIResponse } from 'beamApiProps';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './menu.scss';
import { MenuBtn } from '../../constants/app_constants';
import { menuProps } from '../../constants/menu_btn';
import { AppStateHandler } from '../../logic/app_state/state_handler';

export default class Menu extends BaseComponent {
  desc: BaseComponent;

  buttons: Map<MenuBtn, Button>;

  constructor() {
    super(Tags.DIV, ['menu']);
    ApiHandler.addObservers(this);
    AppStateHandler.addObservers(this);
    this.desc = new BaseComponent(Tags.SPAN, ['desc']);
    this.buttons = new Map();
    menuProps.forEach((btn) => {
      this.buttons.set(btn.key, this.buttonBuilder(btn));
    });
    const values = this.buttons.values();
    this.append(...values);
  }

  buttonBuilder = (btn: typeof menuProps[number]):Button => {
    const btnKey = new Button();
    btnKey.element.classList.add(`btn_${btn.key}`);
    if (!btn.icon) {
      btnKey.element.innerHTML = ` <span>
      
    ${btn.title}</span>`;
    } else {
      btnKey.element.innerHTML = `${btn.icon} <span>${btn.title}</span>`;
    }
    btnKey.element.addEventListener('click', () => {
      btn.handler();
    });
    return btnKey;
  };

  getBtn = (btn:MenuBtn):Button => this.buttons.get(btn) as Button;

  removeActive = (): void => {
    this.classList.remove('active');
    this.buttons.forEach((value) => {
      value.setDisplay = false;
    });
  };

  addActive = (): void => {
    this.classList.add('active');
    this.buttons.forEach((value, key) => {
      value.setDisplay = key === MenuBtn.RETURN;
    });
  };

  inform = (res:APIResponse):void => {
    switch (res.id) {
      // case ReqID.START_GAME:
      // case ReqID.CANCEL_GAME:
      // case ReqID.CHECK_SOLUTION:
      // case ReqID.TAKE_PENDING_REWARDS:
      //   this.removeActive();
      //   break;
      default:
        break;
    }
  };

  appInform = ({ activeGame, isTx }: IAppState): void => {
    if (!this.classList.contains('active')) {
      this.desc.innerHTML = activeGame ? 'Play and earn!' : '';
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
