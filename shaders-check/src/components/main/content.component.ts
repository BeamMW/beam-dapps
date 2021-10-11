import { InputPlace } from '../input/input_place.component';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';

export default class Content extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['container__content', 'container']);
    this.append(new InputPlace());
  }
}
