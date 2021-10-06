import { Tags } from '../../constants/html';
import BaseComponent from '../base/base.component';
import Main from '../main/main.component';
import Header from '../header/header.component';

export class Container extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['container']);
    this.append(new Header(), new Main());
  }
}
