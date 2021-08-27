import { Tags } from '../../constants/html_tags';
import { APIResponse, BoardType } from 'beamApiProps';
import BaseComponent from '../base/base.component';
import { ApiHandler } from '../../utils/api_handler';
import Menu from '../menu/menu.component';
import Field from '../field/filed.component';
import { ReqID, ResTXStatus } from '../../constants/api_constants';
import { invokeData, txStatus, viewBoard } from '../../utils/request_creators';


import './main.scss'

export default class Main extends BaseComponent {
    menu:Menu;

    constructor(){
        super(Tags.DIV, ['main']);
        ApiHandler.addObservers(this);
        this.menu = new Menu();
        this.append(this.menu)
    }


    initGameField = (board:BoardType):void => {
        this.menu.element.classList.add('active');
        const fl = new Field(board).element;
        this.element.append(fl)
      };

      inform = (res: APIResponse): void => {
          console.log(res);
      
          switch (res.id) {
            case ReqID.START_GAME:
              invokeData(res.result.raw_data);
              break;
            case ReqID.INVOKE_DATA:
              this.menu.initLoader(res.result.txid);
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
              this.menu.initButtonMenu();
              this.initGameField(
                JSON.parse(`{${res.result.output}}`).board as BoardType
              );
              break;
            default:
              break;
          }
        };
}