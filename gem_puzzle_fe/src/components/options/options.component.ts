import { Tags } from '../../constants/html';
import BaseComponent from '../base/base.component';
import AutoPlayOpt from './autoplay.option.component';
import './options.scss';

export default class Options extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['options']);
    const autoplay = new AutoPlayOpt();
    this.append(autoplay);
  }
}
