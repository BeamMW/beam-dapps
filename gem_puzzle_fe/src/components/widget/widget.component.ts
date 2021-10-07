import { APIResponse } from 'beamApiProps';
import { SVG } from '../../constants/svg.icons';
import { toDOMParser } from '../../utils/string_handlers';
import { Routes } from '../../constants/app';
import { Beam } from '../../logic/beam/api_handler';
import { Store } from '../../logic/store/state_handler';
import {
  AppSpecs,
  ReqID,
  ResTXComment,
  ResTXStatus
} from '../../constants/api';
import { Tags } from '../../constants/html';
import BaseComponent from '../base/base.component';
import Loader from '../shared/loader/loader.component';
import WidgetProps from '../shared/widget_info/widget.info.component';
import './widget.scss';
import { AC } from '../../logic/store/app_action_creators';
import { RC } from '../../logic/beam/request_creators';

export default class Widget extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['widget']);
    Beam.addObservers(this);
    const infoBlocks = new BaseComponent(Tags.DIV, ['infoblock-wrapp']);
    const loader = new Loader();
    const txId = window.localStorage.getItem('txId');
    if (txId) {
      Beam.callApi(RC.viewTxStatus(txId));
      Store.dispatch(AC.setIsTx(true));
      this.classList.add('active');
    }
    const transaction = new WidgetProps();
    infoBlocks.append(transaction);
    const closeIcon = toDOMParser(SVG.closeIcon);
    this.append(loader, infoBlocks, closeIcon);
    closeIcon.addEventListener('click', () => {
      this.classList.remove('active');
    });
  }

  transactionHandler = (result: APIResponse['result']): void => {
    const { popup } = Store.getState().info;
    if (result.status_string === ResTXStatus.IN_PROGRESS) {
      setTimeout(
        () => Beam.callApi(RC.viewTxStatus(result.txId)),
        AppSpecs.TX_CHECK_INTERVAL
      );
    }
    if (
      result.status_string === ResTXStatus.FAILED
      || result.status_string === ResTXStatus.COMPLETED
      || result.status_string === ResTXStatus.EXPIRED
    ) {
      this.classList.remove('active');
      window.localStorage.removeItem('txId');
      Store.dispatch(AC.setIsTx(false), 'sync');
      switch (result.comment) {
        case ResTXComment.CHECKIN_SOLUTION:
          if (popup) {
            Store.dispatch(AC.setPopup(false), 'sync');
            setTimeout(() => Beam.callApi(RC.viewCheckResult()), 400);
          } else Beam.callApi(RC.viewCheckResult());
          break;
        case ResTXComment.ENDING_EXISTING_GAME:
          window.localStorage.removeItem('state');
          break;
        default:
          break;
      }
      Beam.callApi(RC.viewMyInfo());
    }
  };

  inform = (res: APIResponse): void => {
    if (res.result) {
      switch (res.id) {
        case ReqID.START_GAME:
        case ReqID.CHECK_SOLUTION:
          localStorage.removeItem('state');
          Beam.callApi(RC.invokeData(res.result.raw_data));
          break;

        case ReqID.TAKE_PENDING_REWARDS:
          Beam.callApi(RC.invokeData(res.result.raw_data));
          break;

        case ReqID.INVOKE_DATA:
          if (res.result?.txid) {
            if (window.location.pathname !== Routes.MAIN) {
              window.history.pushState({}, '', Routes.MAIN);
            }
            window.localStorage.setItem('txId', res.result.txid);
            this.classList.add('active');
            Store.dispatch(AC.setIsTx(true), 'sync');
            Beam.callApi(RC.viewTxStatus(res.result.txid));
          }
          break;

        case ReqID.TX_STATUS:
          this.transactionHandler(res.result);
          break;

        case ReqID.DONATE:
          Beam.callApi(RC.invokeData(res.result.raw_data));
          break;
        default:
      }
    }
  };
}
