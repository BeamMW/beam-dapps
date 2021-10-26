import { IActionParams } from 'beamApiProps';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';

export class ValueInput extends BaseComponent {
  action: string;

  constructor(
    action:[string, IActionParams]
  ) {
    super(Tags.INPUT, ['method__input']);
    this.action = action[0];
    this.element.id = action[0];
    this.setAttributes({ type: 'radio', name: 'method' });
  }
}
