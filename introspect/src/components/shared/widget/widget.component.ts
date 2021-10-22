import { APIResponse } from 'beamApiProps';
import { AC } from '../../../logic/store/action_creators';
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

const txData = [
  {
    value: '...',
    key: 'txId',
    title: 'ID:'
  },
  {
    value: '...',
    key: 'comment',
    title: 'COMMENT:'
  },
  {
    value: ResTXStatus.IN_PROGRESS,
    key: 'status_string',
    title: 'STATUS:'
  }
];

export default class Widget extends BaseComponent {
  action: string;

  loader: Loader;

  removeFromDom: (...args: BaseComponent[]) => void;

  private canRemoveFromStore = false;

  constructor(
    [actionKey, tx]: [string, string],
    callback: (...args: BaseComponent[]) => void
  ) {
    super(Tags.TABLE, ['widget']);
    this.action = actionKey;
    this.removeFromDom = callback;
    BEAM.callApi(RC.txStatus(actionKey, tx));
    BEAM.subscribe(this);

    const infoBlocks = this.createInfoblocks(actionKey);
    const loader = new Loader();
    this.loader = loader;
    const closeIcon = toDOMParser(SVG.iconCancel);

    closeIcon.addEventListener('click', this.removeThis);

    this.append(loader, infoBlocks, closeIcon);
  }

  private createInfoblocks = (action: string):BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['infoblock-wrapp']);
    const txProperties = txData.map((element) => new WidgetProps(
      { ...element, action }
    ));
    component.append(...txProperties);
    return component;
  };

  private removeThis = ():void => {
    if (this.canRemoveFromStore) {
      this.removeFromDom(this);
      STORE.dispatch(AC.removeTxs(this.action));
    } else this.style.display = 'none';
  };

  private getTxStatus = (status: string, reqId: string, txId: string): void => {
    switch (status) {
      case ResTXStatus.IN_PROGRESS:
        setTimeout(() => {
          BEAM.callApi(RC.txStatus(reqId, txId));
        }, ShaderProps.TX_CHECK_INTERVAL);
        break;

      case ResTXStatus.COMPLETED:
        this.loader.setOK(true);
        this.setRemovableFromStore();
        break;

      default:
        this.loader.setOK(false);
        this.setRemovableFromStore();
        break;
    }
  };

  private setRemovableFromStore = () => {
    this.canRemoveFromStore = true;
    if (this.style.display === 'none') this.removeThis();
  };

  public inform = (res: APIResponse): void => {
    const { result } = res;
    if (res.id === this.action) {
      this.getTxStatus(result.status_string, this.action, result.txId);
    }
  };
}
