import { APIResponse, BoardType } from 'beamApiProps';
import { ReqID, ResTXStatus } from '../../constants/api_constants';
import { ApiHandler } from '../../utils/api_handler';
import { Tags } from '../../constants/html_tags';
import { menuBtn } from '../../constants/menu_btn';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';
import Field from '../field/filed.component';
import './menu.scss';
import { invokeData, txStatus, viewBoard } from '../../utils/request_creators';
import Loader from '../loader/loader.component';
import Header from '../header/header.component';

const BODY = document.body;
export default class Menu extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu']);
    ApiHandler.addObservers(this);
    this.initButtonMenu();
  }

  initButtonMenu = (): void => {
    this.removeAll();
    const buttons = menuBtn.map(btn => {
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

  initGameField = (board: BoardType): void => {
    const menu = document.querySelector('.menu');
    menu?.classList.add('active');
    const fl = new Field(board).element;
    BODY.append(fl);
  };

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.CHECK:
        console.log(JSON.parse(res.result.output));
        break;
      case ReqID.START_GAME:
        invokeData(res.result.raw_data);
        break;
      case ReqID.DESTROY:
        invokeData(res.result.raw_data);
        break;
      case ReqID.CANCEL_GAME:
        invokeData(res.result.raw_data);
        break;
      case ReqID.INVOKE_DATA:
        this.initLoader(res.result.txid);
        txStatus(res.result.txid);
        break;
      case ReqID.TX_STATUS:
        if (res.result.status_string === ResTXStatus.IN_PROGRESS) {
          txStatus(res.result.txId);
        } else {
          viewBoard();
        }
        break;
      case ReqID.VIEW_BOARD:
        try {
          this.initButtonMenu();
          this.initGameField(JSON.parse(res.result.output).board as BoardType);
        } catch {
          console.error(res.result.output);
        }

        break;
      default:
        break;
    }
  };
}
