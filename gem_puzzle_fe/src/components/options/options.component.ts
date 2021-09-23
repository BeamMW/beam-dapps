import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import AutoPlayOpt from './autoplay.option.component';
import './options.scss';
import Rate from './rate.option.component';

export default class Options extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['options']);
    const rate = new Rate();
    const autoplay = new AutoPlayOpt();
    this.append(rate, autoplay);
  }
}
