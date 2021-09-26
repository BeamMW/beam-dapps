import { APIResponse, ResOutput } from 'beamApiProps';
import { Store } from '../../logic/store/state_handler';
import { Beam } from '../../logic/beam/api_handler';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import Menu from './menu/menu.component';
import { Field } from '../game/field.component';
import { ReqID } from '../../constants/api';
import { RC } from '../../logic/beam/request_creators';
import './main.scss';
import Router from '../../logic/router/router';
import Options from '../options/options.component';
import { RouterMode, Routes } from '../../constants/app';
import { AC } from '../../logic/store/app_action_creators';
import Popup from '../popup/popup.component';
import { Game } from '../game/game.component';

export default class Main extends BaseComponent {
  private readonly menu: Menu;

  private readonly popupWon: Popup;

  private readonly router: Router;

  private child: Field | Options | null;

  constructor() {
    super(Tags.DIV, ['main']);
    Beam.addObservers(this);
    Beam.callApi(RC.viewMyInfo());
    this.menu = new Menu();
    this.popupWon = new Popup();
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
    this.child = new Game();
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

  inform = (res: APIResponse): void => {
    let output;
    if (res.result?.output) {
      output = JSON.parse(res.result.output) as ResOutput;
    }
    switch (res.id) {
      case ReqID.VIEW_CONTRACT_PARAMS:
        if (output) {
          Store.dispatch(
            AC.setCidParams({
              ...output
            })
          );
          if (output.prize_aid) {
            Beam.callApi(RC.viewAssetInfo(output.prize_aid));
          }
        }
        break;
      case ReqID.VIEW_ASSET_INFO:
        console.log(res);
        break;

      case ReqID.CHECK_SOLUTION:
        if (this.router.current?.length) {
          this.cancelGame();
        }
        break;

      case ReqID.VIEW_BOARD:
        if (output) {
          Store.dispatch(
            AC.setGame({
              board: output.board,
              status: 'ready',
              solution: [],
              permutation: output.permutation
            })
          );
        }
        break;

      case ReqID.VIEW_MY_INFO:
        if (output) {
          Store.dispatch(
            AC.setMyInfo({
              has_active_game: output.has_active_game,
              pending_rewards: output.pending_rewards
            })
          );
        }
        break;

      default:
        break;
    }
  };
}
