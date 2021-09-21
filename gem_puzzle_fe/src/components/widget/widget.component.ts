import { APIResponse } from 'beamApiProps';
import { Store } from '../../logic/store/state_handler';
import {
  AppSpecs,
  ReqID,
  ResTXComment,
  ResTXStatus
} from '../../constants/api_constants';
import { Tags } from '../../constants/html_tags';
import { Beam } from '../../logic/beam/api_handler';
import BaseComponent from '../base/base.component';
import Loader from '../loader/loader.component';
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
      setTimeout(() => Beam.callApi(RC.viewTxStatus(result.txId)),
        AppSpecs.TX_CHECK_INTERVAL);
    }
    if (result.status_string === ResTXStatus.FAILED
      || result.status_string === ResTXStatus.COMPLETED) {
      this.classList.remove('active');
      window.localStorage.removeItem('txId');
      Store.dispatch(AC.setIsTx(false));
      switch (result.comment) {
        case ResTXComment.CHECKIN_SOLUTION:
          Beam.callApi(RC.viewCheckResult());
          Beam.callApi(RC.viewMyInfo());
          break;
        default:
          Beam.callApi(RC.viewMyInfo());
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
        Beam.callApi(RC.invokeData(res.result.raw_data));
        break;
      case ReqID.TAKE_PENDING_REWARDS:
        Beam.callApi(RC.invokeData(res.result.raw_data));
        Beam.callApi(RC.viewMyInfo());
        break;
      case ReqID.INVOKE_DATA:
        if (res.result?.txid) {
          window.localStorage.setItem('txId', res.result.txid);
          Store.dispatch(AC.setIsTx(true));
          this.classList.add('active');
          setTimeout(() => Beam.callApi(RC.viewTxStatus(res.result.txid)),
            AppSpecs.TX_CHECK_INTERVAL);
        }
        break;
      case ReqID.TX_STATUS:
        this.transactionHandler(res.result);
        break;
      default:
    }
  };
}
