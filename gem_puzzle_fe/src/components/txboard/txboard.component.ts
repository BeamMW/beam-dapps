import { APIResponse } from 'beamApiProps';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import { ReqID, ResTXStatus } from '../../constants/api_constants';
import './txboard.scss';

export default class TxBoard extends BaseComponent {
  constructor(txId:string | null) {
    super(Tags.DIV, ['txboard']);
    this.element.innerText = `
    TxId: ${txId || 'not avialable'} status: ${ResTXStatus.IN_PROGRESS}
    `;
    ApiHandler.addObservers(this);
  }

  inform = (res:APIResponse):void => {
    if (res.id === ReqID.TX_STATUS) {
      this.element.innerText = `
      TxId: ${res.result.txId} status: ${res.result.status_string}
      `;
    }
  };
}