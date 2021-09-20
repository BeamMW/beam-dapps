import { APIResponse } from 'beamApiProps';
import { setIsTxAC } from '../../logic/app_state/app_action_creators';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import {
  ReqID,
  ResTXComment,
  ResTXStatus
} from '../../constants/api_constants';
import { Tags } from '../../constants/html_tags';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import {
  invokeData,
  viewActiveGame,
  viewCheckResult,
  viewMyPendingRewards,
  viewTxStatus
} from '../../logic/beam_api/request_creators';
import BaseComponent from '../base/base.component';
import Loader from '../loader/loader.component';
import WidgetProps from './infoblock_widget.component';
import './widget.scss';

export default class Widget extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['widget']);
    ApiHandler.addObservers(this);
    const infoBlocks = new BaseComponent(Tags.DIV, ['infoblock-wrapp']);
    const loader = new Loader();
    const txId = window.localStorage.getItem('txId');
    if (txId) {
      viewTxStatus(txId);
      AppStateHandler.dispatch(setIsTxAC(true));
      this.classList.add('active');
    }
    const transactionId = new WidgetProps(
      {
        value: txId || '...',
        key: 'txId',
        title: 'ID: '
      }
    );
    const comment = new WidgetProps(
      {
        value: '...',
        key: 'comment',
        title: 'COMMENT: '
      }
    );
    const status = new WidgetProps(
      {
        value: ResTXStatus.IN_PROGRESS,
        key: 'status_string',
        title: 'STATUS: '
      }
    );
    infoBlocks.append(transactionId, comment, status);
    this.append(loader, infoBlocks);
  }

  transactionHandler = (result: APIResponse['result']):void => {
    if (result.status_string === ResTXStatus.IN_PROGRESS) {
      viewTxStatus(result.txId);
    }
    if (result.status_string === ResTXStatus.FAILED
      || result.status_string === ResTXStatus.COMPLETED) {
      this.classList.remove('active');
      window.localStorage.removeItem('txId');
      AppStateHandler.dispatch(setIsTxAC(false));
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
        invokeData(res.result.raw_data);
        break;
      case ReqID.TAKE_PENDING_REWARDS:
        invokeData(res.result.raw_data);
        viewMyPendingRewards();
        break;
      case ReqID.INVOKE_DATA:
        if (res.result?.txid) {
          window.localStorage.setItem('txId', res.result.txid);
          AppStateHandler.dispatch(setIsTxAC(true));
          this.classList.add('active');
          viewTxStatus(res.result.txid);
        }
        break;
      case ReqID.TX_STATUS:
        this.transactionHandler(res.result);
        break;
      default:
    }
  };
}
