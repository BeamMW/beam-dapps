import { APIResponse, PlayerInfoType } from 'beamApiProps';
import { WinArgsType } from 'ComponentProps';
import { Win } from '../win/win.components';
import { Store } from '../../logic/app_state/state_handler';
import { Beam } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Menu from '../menu/menu.component';
import { Field } from '../field/field.component';
import {
  ReqID
} from '../../constants/api_constants';
import {
  RC
} from '../../logic/beam_api/request_creators';
import './main.scss';
import Router from '../../logic/router/router';
import Options from '../options/options.component';
import {
  RouterMode,
  Routes
} from '../../constants/app_constants';
import { Best } from '../best/best.component';
import { AC } from '../../logic/app_state/app_action_creators';

export default class Main extends BaseComponent {
  private readonly menu: Menu;

  private readonly router: Router;

  private child: Field | Win | Options | Best | null;

  constructor() {
    super(Tags.DIV, ['main']);
    Beam.addObservers(this);
    Beam.callApi(RC.viewMyInfo());
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
    Beam.callApi(RC.viewMyInfo());
    window.history.pushState({}, '', Routes.MAIN);
  };

  bestField = (top:any): void => {
    if (this.child) this.remove(this.child);
    Beam.callApi(RC.viewMyInfo());
    if (!top) Beam.callApi(RC.viewTops());
    this.child = new Best(top);
    this.menu.replace(this.child);
    this.menu.addActive();
    this.append(this.menu);
    Store.addObservers(this.menu);
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

  winner = (res:WinArgsType): void => {
    if (this.child) this.remove(this.child);
    Beam.callApi(RC.viewMyInfo());
    this.menu.addActive();
    this.child = new Win(res);
    this.append(this.child);
  };

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.CHECK:
        console.log(JSON.parse(res.result.output));
        break;

      case ReqID.CHECK_SOLUTION:
        if (this.router.current?.length) {
          this.cancelGame();
        }
        break;

      case ReqID.VIEW_MY_INFO:
        Store.dispatch(
          (AC.setMyInfo(
            JSON.parse(res.result.output) as PlayerInfoType
          ))
        );
        break;

      case ReqID.VIEW_TOPS:
        console.log(`${res.result.output}`);
        this.bestField(JSON.parse(`${res.result.output}`));
        break;

      case ReqID.VIEW_CHECK_RESULT:
        this.winner(JSON.parse(res.result.output));
        break;

      default:
        break;
    }
  };
}
