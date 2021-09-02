import { AppSpecs } from '../../constants/api_constants';
import { AppStateHandler } from '../../logic/app_state/state.handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import InfoBLock from './infoblock.component';
import './header.scss';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const { rate, mode } = AppStateHandler.getState();
    const rateBlock = new InfoBLock({
      key: 'rate',
      title: 'RATE',
      value: rate
    });
    const modeBlock = new InfoBLock({
      key: 'mode',
      title: 'MODE',
      value: mode
    });
    const cidBlock = new InfoBLock({
      key: 'ContractID',
      title: 'ContractID',
      value: AppSpecs.CID
    });
    this.append(rateBlock, modeBlock, cidBlock);
  }
}
