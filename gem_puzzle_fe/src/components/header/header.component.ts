import { AppStateHandler } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './header.scss';
import { boardSchemeMaker } from '../../utils/string_handlers';
import InfoBLock from './infoblock.component';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const {
      rate, mode, pKey, picOpt, activeGame
    } = AppStateHandler.getState();
    const rateBlock = new InfoBLock({
      key: 'rate',
      title: 'RATE',
      value: rate,
      after: 'BEAM'
    });
    const viewBlock = new InfoBLock({
      key: 'picOpt',
      title: 'VIEW',
      value: picOpt,
      after: ''
    });
    const modeBlock = new InfoBLock({
      key: 'mode',
      title: 'MODE',
      value: boardSchemeMaker(mode),
      after: '',
      callback: boardSchemeMaker
    });
    const cidBlock = new InfoBLock({
      key: 'pKey',
      title: 'KEY',
      value: pKey,
      after: ''
    });

    const isActiveBlock = new InfoBLock({
      key: 'activeGame',
      title: 'ACTIVE GAME',
      value: `${activeGame}`.toUpperCase(),
      after: '',
      callback: (str:boolean):string => `${str}`.toUpperCase()
    });
    this.append(cidBlock, isActiveBlock, rateBlock, viewBlock, modeBlock);
  }
}
