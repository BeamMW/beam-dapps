import { APIResponse } from 'beamApiProps';
import { ReqID, ResTXStatus } from '../../constants/api_constants';
import { Tags } from '../../constants/html_tags';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { txStatus } from '../../logic/beam_api/request_creators';
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
      txStatus(txId);
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

  inform = (res: APIResponse): void => {
    if (res.id === ReqID.INVOKE_DATA) {
      if (res.result.txid) {
        window.localStorage.setItem('txId', res.result.txid);
        this.classList.add('active');
      }
    }
    if (res.id === ReqID.TX_STATUS) {
      if (res.result.status_string === ResTXStatus.FAILED
        || res.result.status_string === ResTXStatus.COMPLETED) {
        this.classList.remove('active');
        window.localStorage.removeItem('txId');
      }
    }
  };
}
