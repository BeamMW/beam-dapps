import { APIResponse } from 'beamApiProps';
import { ReqID } from '../../constants/api_constants';
import { ApiHandler } from '../../utils/api_handler';
import { Tags } from '../../constants/html_tags';
import { menuBtn } from '../../constants/menu_btn';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import Field from '../field/filed.component';
import './menu.scss';
import { invokeData, viewBoard } from '../../utils/request_creators';

const BODY = document.body
export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu']);
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
    if (res.id === ReqID.START_GAME || res.id === ReqID.EXIT_GAME) {
      invokeData(res.result.raw_data);
    }
    if (res.id === ReqID.INVOKE_DATA) {
      viewBoard();
    }
    if (res.id === ReqID.VIEW_BOARD){
      const menu = document.querySelector('.menu')
      menu && menu.classList.add('active')
      const fl = new Field().element
      BODY.append(fl);
      console.log(res.result)
    }
    console.log(res);
  };
}
