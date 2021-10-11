import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { SVG } from '../../../../../../../constants/svg.icons';

export class Clear extends BaseComponent {
  constructor() {
    super(Tags.BUTTON, ['button', 'clear']);
    (<HTMLInputElement> this.element).value = 'clear';
    this.innerHTML = `${SVG.iconCancel} clear`;
    this.element.setAttribute('type', 'submit');
  }
}
