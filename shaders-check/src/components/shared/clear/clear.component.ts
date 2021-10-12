import { Tags } from '../../../constants/html_elements';
import { SVG } from '../../../constants/svg.icons';
import BaseComponent from '../base/base.component';

export class Clear extends BaseComponent {
  constructor() {
    super(Tags.BUTTON, ['button', 'clear']);
    (<HTMLInputElement> this.element).value = 'clear';
    this.innerHTML = `${SVG.iconCancel} clear`;
  }
}
