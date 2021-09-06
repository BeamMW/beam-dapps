import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Mode from './mode.option.component';
import './options.scss';
import PicOption from './picture.option.component';
import Rate from './rate.option.component';

export default class Options extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['options']);
    const rate = new Rate();
    const mode = new Mode();
    const picOpt = new PicOption();
    this.append(rate, mode, picOpt);
  }
}
