import { APIResponse, PlayerInfoType } from 'beamApiProps';
import { WinArgsType } from 'ComponentProps';
import { BoardType } from 'AppStateProps';
import { Win } from '../win/win.components';
import { Store } from '../../logic/store/state_handler';
import { Beam } from '../../logic/beam/api_handler';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import Menu from '../menu/menu.component';
import { Field } from '../field/field.component';
import { ReqID } from '../../constants/api';
import { RC } from '../../logic/beam/request_creators';
import './main.scss';
import Router from '../../logic/router/router';
import Options from '../options/options.component';
import { RouterMode, Routes } from '../../constants/app';
import { Best } from '../best/best.component';
import { AC } from '../../logic/store/app_action_creators';
import Popup from '../popup/popup.component';

export default class Main extends BaseComponent {
  private readonly menu: Menu;

  private readonly router: Router;

  private child: Field | Win | Options | Best | null;

  private readonly popupWon: Popup;

  constructor() {
    super(Tags.DIV, ['main']);
    Beam.addObservers(this);
    Beam.callApi(RC.viewMyInfo());
    this.menu = new Menu();
    this.popupWon = new Popup({ key: 'won' });
    this.router = new Router({
      mode: RouterMode.HISTORY,
      root: Routes.MAIN
    });
    this.child = null;
    this.router.add(Routes.OPTIONS, this.optionsField);
    this.router.add(Routes.RETURN, this.cancelGame);
    this.router.add(Routes.PLAY, this.initGameField);
    this.router.add('', this.initMainMenu);
    this.append(this.menu, this.popupWon);
  }

  initMainMenu = (): void => {
    this.child = null;
  };

  cancelGame = (): void => {
    if (this.child) this.remove(this.child);
    this.menu.removeActive();
    Beam.callApi(RC.viewMyInfo());
    window.history.pushState({}, '', Routes.MAIN);
  };

  initGameField = (): void => {
    if (this.child) this.remove(this.child);
    this.child = new Field();
    this.menu.replace(this.child);
    this.menu.addActive();
    this.append(this.menu);
    Store.addObservers(this.menu);
  };

  optionsField = (): void => {
    if (this.child) this.remove(this.child);
    this.menu.addActive();
    this.child = new Options();
    this.menu.replace(this.child);
    this.append(this.menu);
    Store.addObservers(this.menu);
  };

  winner = (res: WinArgsType): void => {
    if (this.child) this.remove(this.child);
    Beam.callApi(RC.viewMyInfo());
    console.log(res);
    // this.append(this.child);
    this.append(this.popupWon);
    this.popupWon.addActive();
  };

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.VIEW_CONTRACT_PARAMS:
        Store.dispatch(
          AC.setCidParams({
            bet: JSON.parse(res.result.output).bet as number
          })
        );
        break;

      case ReqID.CHECK_SOLUTION:
        if (this.router.current?.length) {
          this.cancelGame();
        }
        break;

      case ReqID.VIEW_BOARD:
        Store.dispatch(
          AC.setGame({
            board: JSON.parse(res.result.output).board as BoardType,
            status: 'ready',
            solution: [],
            permutation: JSON.parse(res.result.output).permutation as number
          })
        );
        break;

      case ReqID.VIEW_MY_INFO:
        Store.dispatch(
          AC.setMyInfo(JSON.parse(res.result.output) as PlayerInfoType)
        );
        break;

      case ReqID.VIEW_CHECK_RESULT:
        this.winner(JSON.parse(res.result.output));
        break;

      default:
        break;
    }
  };
}
