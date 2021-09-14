import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './menu.scss';
import Loader from '../loader/loader.component';
import TxBoard from '../txboard/txboard.component';
import { MenuBtn } from '../../constants/app_constants';
import { menuProps } from '../../constants/menu_btn';
import { AppStateHandler } from '../../logic/app_state/state_handler';

export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu']);
    ApiHandler.addObservers(this);
  }

  initButtonMenu = (): void => {
    this.removeAll();
    const { activeGame } = AppStateHandler.getState();
    const buttons = menuProps
      .filter((btn) => {
        if (this.classList.contains('active') && btn.key !== MenuBtn.RETURN) {
          return false;
        }
        if (
          !this.classList.contains('active')
          && btn.key === MenuBtn.RETURN
        ) {
          return false;
        }
        if (activeGame && btn.key === MenuBtn.NEW) {
          return false;
        }
        if (!activeGame && (
          btn.key === MenuBtn.CANCEL
          || btn.key === MenuBtn.CONTINUE
        )) {
          return false;
        }
        return true;
      })
      .map((btn) => {
        const btnKey = new Button();
        btnKey.element.classList.add(`btn_${btn.key}`);
        btnKey.setAttributes({ value: btn.title });
        btnKey.element.addEventListener('click', () => {
          btn.handler();
        });
        return btnKey;
      });
    this.append(...buttons);
  };

  removeActive = ():void => this.classList.remove('active');

  addActive = ():void => this.classList.add('active');

  initLoader = (txid?: string): void => {
    const args = [new Loader()];
    if (txid) {
      args.unshift(new TxBoard(txid));
    }
    this.removeAll();
    this.append(...args);
  };
}
