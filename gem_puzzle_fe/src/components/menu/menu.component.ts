import { ApiHandler } from '../../utils/api_handler';
import { Tags } from '../../constants/html_tags';
import { menuBtn } from '../../constants/menu_btn';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './menu.scss';
import Loader from '../loader/loader.component';
import Header from '../header/header.component';


export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu']);
    ApiHandler.addObservers(this);
    this.initButtonMenu();
  }

  initButtonMenu = (): void => {
    this.removeAll();
    const buttons = menuBtn.map((btn) => {
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
    this.append(new Header(txid), new Loader());
  };
}
