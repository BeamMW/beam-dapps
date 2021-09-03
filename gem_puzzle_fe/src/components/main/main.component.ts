import { APIResponse, BoardType } from 'beamApiProps';
import { setPKeyAC } from '../../logic/app_state/app_action_creators';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Menu from '../menu/menu.component';
import { Field } from '../field/filed.component';
import { ReqID, ResTXStatus } from '../../constants/api_constants';
import {
  checkSolutionTx,
  getPlayerKey,
  invokeData,
  invokeDataSolution,
  txStatus,
  viewBoard
} from '../../logic/beam_api/request_creators';
import './main.scss';
import Router from '../../logic/router/router';
import Options from '../options/options.component';
import { Win } from '../win/win.components';
import { RouterMode, Routes } from '../../constants/app_constants';

export default class Main extends BaseComponent {
  menu: Menu;

  win: Win;

  private readonly router: Router;

  constructor() {
    super(Tags.DIV, ['main']);
    ApiHandler.addObservers(this);
    getPlayerKey();
    this.menu = new Menu();
    this.router = new Router({
      mode: RouterMode.HISTORY,
      root: Routes.MAIN
    });
    this.win = new Win();
    this.append(this.menu);
    this.router.add(Routes.OPTIONS, this.optionsField);
    this.router.add(Routes.RETURN, this.cancelGame);
    this.router.add(Routes.BEST, this.bestField);
  }

  cancelGame = (): void => {
    this.removeAll();
    this.menu.classList.remove('active');
    this.menu.initButtonMenu();
    this.append(this.menu);
    window.history.pushState({}, '', Routes.MAIN);
  };

  bestField = (): void => {
    console.log('best');
  };

  initGameField = (board: BoardType): void => {
    this.menu.classList.add('active');
    this.menu.initButtonMenu();
    Field.ready(board);
  };

  optionsField = (): void => {
    this.removeAll();
    this.menu.classList.add('active');
    this.menu.initButtonMenu();
    const options = new Options();
    this.append(this.menu, options);
  };

  winner = (): void => {
    this.menu.initButtonMenu();
    this.menu.element.classList.add('active');
    this.append(this.menu);
    this.append(this.win);
  };

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.GET_PKEY:
        AppStateHandler.dispatch(
          setPKeyAC(JSON.parse(`{${res.result.output}}`)['My public key'])
        );
        break;
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
        this.cancelGame();
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
        this.initGameField(JSON.parse(res.result.output).board as BoardType);
        break;
      case ReqID.CHECK_SOLUTION:
        invokeDataSolution(res.result.raw_data);
        break;
      case ReqID.INVOKE_DATA_SOLUTION:
        this.menu.initLoader(res.result.txid);
        this.menu.element.classList.remove('active');
        checkSolutionTx(res.result.txid);
        break;
      case ReqID.TX_CHECK_SOLUTION:
        if (res.result.status_string === ResTXStatus.IN_PROGRESS) {
          checkSolutionTx(res.result.txId);
        } else {
          this.winner();
        }
        break;
      case ReqID.VIEW_CHECK_RESULT:
        console.log('WIN');
        break;
      default:
        break;
    }
  };
}
