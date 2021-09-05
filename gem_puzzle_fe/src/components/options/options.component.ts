import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import Mode from './mode.component';
import './options.scss';
import Rate from './rate.component';

export default class Options extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['options']);
    const rate = new Rate();
    const mode = new Mode();
    this.append(rate, mode);
  }
}
