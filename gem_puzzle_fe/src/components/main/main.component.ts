import { APIResponse } from 'beamApiProps';
import { WinArgsType } from 'ComponentProps';
import { Win } from '../win/win.components';
import {
  setActiveGameAC,
  setMyPendingRewardAC, setPKeyAC
} from '../../logic/app_state/app_action_creators';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Menu from '../menu/menu.component';
import { Field } from '../field/field.component';
import {
  ReqID,
  ResTXComment,
  ResTXStatus
} from '../../constants/api_constants';
import {
  viewActiveGame,
  viewPlayerKey,
  invokeData,
  txStatus,
  viewCheckResult,
  viewMyPendingRewards,
  viewTops
} from '../../logic/beam_api/request_creators';
import './main.scss';
import Router from '../../logic/router/router';
import Options from '../options/options.component';
import {
  RouterMode,
  Routes,
  BeamAmmount
} from '../../constants/app_constants';
import { Best } from '../best/best.component';

export default class Main extends BaseComponent {
  private readonly menu: Menu;

  private readonly router: Router;

  private child: Field | Win | Options | Best | null;

  constructor() {
    super(Tags.DIV, ['main']);
    ApiHandler.addObservers(this);
    viewPlayerKey();
    viewMyPendingRewards();
    viewActiveGame();
    this.menu = new Menu();
    this.router = new Router({
      mode: RouterMode.HISTORY,
      root: Routes.MAIN
    });
    this.child = null;
    this.router.add(Routes.OPTIONS, this.optionsField);
    this.router.add(Routes.RETURN, this.cancelGame);
    this.router.add(Routes.BEST, this.bestField);
    this.router.add(Routes.PLAY, this.initGameField);
    this.router.add('', this.initMainMenu);
    this.append(this.menu);
  }

  initMainMenu = ():void => {
    this.child = null;
  };

  cancelGame = (): void => {
    if (this.child) this.remove(this.child);
    this.menu.removeActive();
    viewActiveGame();
    viewMyPendingRewards();
    window.history.pushState({}, '', Routes.MAIN);
  };

  bestField = (top:any): void => {
    if (this.child) this.remove(this.child);
    viewActiveGame();
    viewMyPendingRewards();
    if (!top) viewTops();
    this.child = new Best(top);
    this.menu.replace(this.child);
    this.menu.addActive();
    this.append(this.menu);
    AppStateHandler.addObservers(this.menu);
  };

  initGameField = (): void => {
    if (this.child) this.remove(this.child);
    this.child = new Field();
    this.menu.replace(this.child);
    this.menu.addActive();
    this.append(this.menu);
    AppStateHandler.addObservers(this.menu);
  };

  optionsField = (): void => {
    if (this.child) this.remove(this.child);
    this.menu.addActive();
    this.child = new Options();
    this.menu.replace(this.child);
    this.append(this.menu);
    AppStateHandler.addObservers(this.menu);
  };

  winner = (res:WinArgsType): void => {
    if (this.child) this.remove(this.child);
    viewMyPendingRewards();
    this.menu.addActive();
    this.child = new Win(res);
    this.append(this.child);
  };

  transactionHandler = (result: APIResponse['result']):void => {
    if (result.status_string === ResTXStatus.IN_PROGRESS) {
      txStatus(result.txId);
    }
    if (result.status_string === ResTXStatus.FAILED) {
      this.cancelGame();
    }
    if (result.status_string === ResTXStatus.COMPLETED) {
      window.localStorage.removeItem('txId');
      switch (result.comment) {
        case ResTXComment.CHECKIN_SOLUTION:
          viewCheckResult();
          break;
        default:
          viewActiveGame();
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
        invokeData(res.result.raw_data);
        if (this.router.current) {
          window.history.pushState({}, '', `/${Routes.RETURN}`);
        }
        break;

      case ReqID.INVOKE_DATA:
        if (res.result?.txid) {
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
            JSON.parse(res.result.output)
              .pending_rewards / BeamAmmount.GROTHS_IN_BEAM
          )
        );
        break;

      default:
        break;
    }
  };
}
