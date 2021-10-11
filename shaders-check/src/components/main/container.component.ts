import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import Content from './content.component';
import Header from '../header/header.component';

export default class Container extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['main']);
    this.append(new Header(), new Content());
  }
}
