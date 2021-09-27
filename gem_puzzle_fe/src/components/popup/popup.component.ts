import { APIResponse, ResOutput } from 'beamApiProps';
import { IState } from 'AppStateProps';
import { Limit } from './elements/limit.component';
import { Beam } from '../../logic/beam/api_handler';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import { Store } from '../../logic/store/state_handler';
import { PopupKeys } from '../../constants/app';
import './popup.scss';
import { Win } from './elements/win.component';
import { Lose } from './elements/lose.component';
import { ReqID } from '../../constants/api';
import { AC } from '../../logic/store/app_action_creators';
import { Donate } from './elements/donate.component';

export default class Popup extends BaseComponent {
  private child: BaseComponent;

  private key: PopupKeys | false;

  private data: number;

  constructor() {
    super(Tags.DIV, ['popup']);
    Beam.addObservers(this);
    Store.addObservers(this);
    this.data = 0;
    this.child = new Win(this.data);
    this.key = false;
    this.append(this.child);
  }

  private readonly addActive = (isActive: boolean): void => {
    if (isActive) this.classList.add('active');
    else this.classList.remove('active');
  };

  readonly inform = (res: APIResponse):void => {
    let output;
    if (res.result?.output) {
      output = JSON.parse(res.result.output) as ResOutput;
      switch (res.id) {
        case ReqID.VIEW_CHECK_RESULT:
          if (output) {
            this.data = output['time (min)'];
            Store.dispatch(AC.setPopup(
              output.verdict === 'WIN'
                ? PopupKeys.WIN
                : PopupKeys.LOSE
            ));
          }
          break;
        default:
          break;
      }
    }
  };

  readonly appInform = (state: IState): void => {
    const { popup } = state.info;
    if (popup !== this.key) {
      if (popup) {
        switch (popup) {
          case PopupKeys.WIN:
            this.child.replace(new Win(this.data));
            break;
          case PopupKeys.LOSE:
            this.child.replace(new Lose());
            break;
          case PopupKeys.LIMIT:
            this.child.replace(new Limit());
            break;
          case PopupKeys.DONATE:
            this.child.replace(new Donate());
            break;
          default:
            break;
        }
        Store.addObservers(this);
        this.addActive(true);
      } else {
        this.addActive(false);
      }
      this.key = popup;
    }
  };
}
