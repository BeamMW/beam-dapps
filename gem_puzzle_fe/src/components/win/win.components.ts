import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';

export class Win extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['winner']);
  }
}
