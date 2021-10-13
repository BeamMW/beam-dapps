import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import Header from '../header/header.component';
import { InputPlace } from '../input/input_place.component';

export default class Container extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['main']);
    this.append(new Header(), new InputPlace());
  }
}
