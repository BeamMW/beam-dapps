import { APIResponse } from 'beamApiProps';
import { removeTxsAC } from '../../../logic/store/action_creators';
import { Tags } from '../../../constants/html_elements';
import { SVG } from '../../../constants/svg.icons';
import { ResTXStatus, ShaderProps } from '../../../constants/variables';
import { BEAM } from '../../../controllers/beam.controller';
import BaseComponent from '../base/base.component';
import Loader from '../loader/loader.component';
import './widget.scss';
import WidgetProps from './widget.info.component';
import { RC } from '../../../logic/beam/request_creators';
import { toDOMParser } from '../../../utils/json_handlers';
import { STORE } from '../../../controllers/store.controller';

export default class Widget extends BaseComponent {
  action: string;

  removeFromDom: (...args: BaseComponent[]) => void;

  constructor(
    action: [string, string],
    callback: (...args: BaseComponent[]) => void
  ) {
    super(Tags.TABLE, ['widget']);
    BEAM.callApi(RC.txStatus(...action));
    this.action = action[0];
    this.removeFromDom = callback;

    BEAM.addObservers(this);
    const infoBlocks = new BaseComponent(Tags.DIV, ['infoblock-wrapp']);
    const loader = new Loader();
    const closeIcon = toDOMParser(SVG.iconCancel);

    const transactionId = new WidgetProps({
      value: '...',
      key: 'txId',
      title: 'ID:',
      action: this.action
    });
    const comment = new WidgetProps({
      value: '...',
      key: 'comment',
      title: 'COMMENT:',
      action: this.action
    });
    const status = new WidgetProps({
      value: ResTXStatus.IN_PROGRESS,
      key: 'status_string',
      title: 'STATUS:',
      action: this.action
    });

    closeIcon.addEventListener('click', this.removeThis);

    infoBlocks.append(transactionId, comment, status);
    this.append(loader, infoBlocks, closeIcon);
  }

  removeThis = ():void => {
    this.removeFromDom(this);
  };

  getTxStatus = (status: string, reqId: string, txId: string): void => {
    if (status === ResTXStatus.IN_PROGRESS) {
      setTimeout(() => {
        BEAM.callApi(RC.txStatus(reqId, txId));
      }, ShaderProps.TX_CHECK_INTERVAL);
    } else {
      this.removeThis();
      STORE.dispatch(removeTxsAC(this.action));
    }
  };

  inform = (res: APIResponse): void => {
    const { result } = res;
    if (res.id === this.action) {
      this.getTxStatus(result.status_string, this.action, result.txId);
    }
  };
}
