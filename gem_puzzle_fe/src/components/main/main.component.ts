import { APIResponse, BoardLengthType, BoardType } from 'beamApiProps';
import { WinArgsType } from 'ComponentProps';
import { Win } from '../win/win.components';
import {
  setActiveGameAC,
  setModeAC, setMyPendingRewardAC, setPKeyAC
} from '../../logic/app_state/app_action_creators';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Menu from '../menu/menu.component';
import { Field } from '../field/filed.component';
import {
  ReqID,
  ResTXComment,
  ResTXStatus
} from '../../constants/api_constants';
import {
  checkActiveGame,
  getPlayerKey,
  invokeData,
  txStatus,
  viewBoard,
  viewCheckResult,
  viewMyPendingRewards,
  viewTops
} from '../../logic/beam_api/request_creators';
import './main.scss';
import Router from '../../logic/router/router';
import Options from '../options/options.component';
import { RouterMode, Routes, BeamAmmount } from '../../constants/app_constants';
import { Best } from '../best/best.component';

export default class Main extends BaseComponent {
  private readonly menu: Menu;

  private readonly router: Router;

  constructor() {
    super(Tags.DIV, ['main']);
    ApiHandler.addObservers(this);
    getPlayerKey();
    checkActiveGame();
    viewMyPendingRewards();
    this.menu = new Menu();
    this.router = new Router({
      mode: RouterMode.HISTORY,
      root: Routes.MAIN
    });
    this.router.add(Routes.OPTIONS, this.optionsField);
    this.router.add(Routes.RETURN, this.cancelGame);
    this.router.add(Routes.BEST, this.bestField);
    this.initMainMenu();
  }

  initMainMenu = ():void => {
    checkActiveGame();
    viewMyPendingRewards();
    this.menu.removeActive();
    this.append(this.menu);
  };

  cancelGame = (): void => {
    checkActiveGame();
    this.removeAll();
    this.menu.removeActive();
    this.append(this.menu);
    window.history.pushState({}, '', Routes.MAIN);
  };

  bestField = (top:any): void => {
    checkActiveGame();
    viewMyPendingRewards();
    const best = new Best(top);
    if (!top) {
      best.initLoader();
      viewTops();
    }
    this.removeAll();
    this.menu.classList.add('active');
    this.append(best, this.menu);
  };

  initGameField = (board: BoardType): void => {
    checkActiveGame();
    if (AppStateHandler.getState().mode !== board.length) {
      AppStateHandler.dispatch(setModeAC(board.length as BoardLengthType));
    }
    this.menu.classList.add('active');
    Field.ready(board);
  };

  optionsField = (): void => {
    checkActiveGame();
    this.removeAll();
    this.menu.addActive();
    const options = new Options();
    this.append(options, this.menu);
  };

  winner = (res:WinArgsType): void => {
    checkActiveGame();
    viewMyPendingRewards();
    this.menu.addActive();
    const win = new Win(res);
    this.append(this.menu, win);
  };

  transactionHandler = (result: APIResponse['result']):void => {
    if (result.status_string === ResTXStatus.IN_PROGRESS) {
      txStatus(result.txId);
    }
    if (result.status_string === ResTXStatus.FAILED) {
      this.cancelGame();
    }
    if (result.status_string === ResTXStatus.COMPLETED) {
      switch (result.comment) {
        case ResTXComment.CREATE_NEW_GAME:
          viewBoard();
          break;
        case ResTXComment.ENDING_EXISTING_GAME:
          this.initMainMenu();
          break;
        case ResTXComment.TAKING_PENDING_REWARS:
          this.initMainMenu();
          break;
        case ResTXComment.CHECKIN_SOLUTION:
          viewCheckResult();
          break;
        default:
          break;
      }
    }
  };

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.CHECK:
        console.log(JSON.parse(res.result.output));
        break;

      case ReqID.START_GAME:
      case ReqID.CANCEL_GAME:
      case ReqID.CHECK_SOLUTION:
      case ReqID.TAKE_PENDING_REWARDS:
        this.menu.removeActive();
        invokeData(res.result.raw_data);
        break;

      case ReqID.INVOKE_DATA:
        if (res.result?.txid) {
          this.menu.initLoader(res.result.txid);
          txStatus(res.result.txid);
        }
        break;

      case ReqID.TX_STATUS:
        this.transactionHandler(res.result);
        break;

      case ReqID.GET_PKEY:
        AppStateHandler.dispatch(
          setPKeyAC(JSON.parse(res.result.output)['My public key'])
        );
        break;

      case ReqID.HAS_ACTIVE_GAME:
        AppStateHandler.dispatch(
          (setActiveGameAC(!!(JSON.parse(res.result.output).has_active_game)))
        );
        this.menu.initButtonMenu();
        break;

      case ReqID.VIEW_BOARD:
        this.menu.initButtonMenu();
        this.initGameField(JSON.parse(res.result.output).board as BoardType);
        break;
      case ReqID.VIEW_TOPS:
        this.bestField(JSON.parse(`[${res.result.output.slice(1, -1)}]`));
        break;

      case ReqID.VIEW_CHECK_RESULT:
        this.winner(JSON.parse(res.result.output));
        break;

      case ReqID.VIEW_MY_PENDING_REWARDS:
        AppStateHandler.dispatch(
          setMyPendingRewardAC(
            JSON.parse(res.result.output).pending_rewards / BeamAmmount.GROTHS_IN_BEAM
            )
        );
        break;
      default:
        break;
    }
  };
}
