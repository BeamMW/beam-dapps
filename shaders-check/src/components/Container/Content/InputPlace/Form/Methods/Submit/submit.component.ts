import BaseComponent from '../../../../../../BaseComponent/base.component';
import { Tags } from '../../../../../../../constants/html_elements';

export class Submit extends BaseComponent {
  constructor() {
    super(Tags.INPUT, ['submit']);
    (<HTMLInputElement> this.element).value = 'Send Request';
    this.element.setAttribute('type', 'submit');
  }
}
