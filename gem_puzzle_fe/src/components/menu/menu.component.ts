import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import { MenuBtn, menuBtn } from '../../constants/menu_btn';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './menu.scss';
import Loader from '../loader/loader.component';
import TxBoard from '../txboard/txboard.component';

export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu']);
    ApiHandler.addObservers(this);
    this.initButtonMenu();
  }

  initButtonMenu = (): void => {
    this.removeAll();
    const buttons = menuBtn
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
        return true;
      })
      .map((btn) => {
        const btnKey = new Button();
        btnKey.element.classList.add(`btn_${btn.key}`);
        btnKey.setAttributes({ value: btn.title });
        btnKey.element.addEventListener('click', () => btn.handler());
        return btnKey;
      });
    this.append(...buttons);
  };

  initLoader = (txid: string): void => {
    this.removeAll();
    this.append(new TxBoard(txid), new Loader());
  };
}
