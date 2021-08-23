import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { ParamsInput } from './input.component';

export class ParamsLabel extends BaseComponent {
  input: ParamsInput;

  constructor(role:[string, unknown]) {
    super(Tags.INPUT, ['params__label']);
    this.input = new ParamsInput(role);
    this.setAttributes({ for: role[0] });
    this.append(this.input);
  }
}
