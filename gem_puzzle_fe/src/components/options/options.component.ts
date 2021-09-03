import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './options.scss';
import Rate from './rate.component';

export default class Options extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['menu']);
    const rate = new Rate();
    this.append(rate);
  }
}
