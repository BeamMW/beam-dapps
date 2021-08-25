import { APIResponse } from 'beamApiProps';
import { ApiId } from '../../constants/api_constants';
import { ApiHandler } from '../../utils/api_handler';
import { Tags } from '../../constants/html_tags';
import { menuBtn } from '../../constants/menu_btn';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import './menu.scss';
import { viewBoard } from '../../utils/request_creators';

export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu', 'active']);
    ApiHandler.addObservers(this);
    const buttons = menuBtn.map((btn) => {
      const btnKey = new Button();
      btnKey.element.classList.add(`btn_${btn.key}`);
      btnKey.setAttributes({ value: btn.key });
      btnKey.element.addEventListener('click', () => btn.handler());
      return btnKey;
    });
    this.append(...buttons);
  }

  inform = (res: APIResponse): void => {
    if (res.id === ApiId.START_GAME) {
      console.log(res);
      viewBoard();
    }
    if (res.id === ApiId.VIEW_BOARD) {
      console.log(res);
    }
  };
}
