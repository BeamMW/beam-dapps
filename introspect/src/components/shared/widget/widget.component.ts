import { APIResponse } from '@alltypes';
import { ResTXStatus, ShaderProps } from '@constants/app-shader';
import { Tags } from '@constants/html-elements';
import { svgData, widgetData } from '@lib/data';
import { RC, AC } from '@logic/action-creators';
import { BEAM, STORE } from '@logic/controllers';
import { toDOMParser } from '@utils/string-handlers';
import BaseComponent from '../base/base.component';
import Loader from '../loader/loader.component';
import WidgetProps from './widget-info.component';
import './widget.scss';

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
    this.loader = new Loader();
    const closeIcon = toDOMParser(svgData.iconCancel);

    closeIcon.addEventListener('click', this.removeThis);

    this.append(this.loader, infoBlocks, closeIcon);
  }

  private createInfoblocks = (action: string):BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['infoblock-wrapp']);
    const txProperties = widgetData.map((element) => new WidgetProps(
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
