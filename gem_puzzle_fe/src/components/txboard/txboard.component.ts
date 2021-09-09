import { ResTXStatus } from '../../constants/api_constants';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import InfoBlockTX from './infoblock_tx.component';
import './txboard.scss';

export default class TxBoard extends BaseComponent {
  constructor(txId: string) {
    super(Tags.DIV, ['txboard']);
    const transactionId = new InfoBlockTX(
      {
        value: txId,
        key: 'txId',
        title: 'ID: '
      }
    );
    const comment = new InfoBlockTX(
      {
        value: '...',
        key: 'comment',
        title: 'COMMENT: '
      }
    );
    const status = new InfoBlockTX(
      {
        value: ResTXStatus.IN_PROGRESS,
        key: 'status_string',
        title: 'STATUS: '
      }
    );
    this.append(transactionId, comment, status);
  }
}
