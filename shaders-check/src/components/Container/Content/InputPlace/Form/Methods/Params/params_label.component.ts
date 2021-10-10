import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../shared/base/base.component';
import { ParamsInput } from './params_input.component';

export class ParamsLabel extends BaseComponent {
  input: ParamsInput;

  constructor(
    role:string
  ) {
    super(Tags.LABEL, ['params__label']);
    this.input = new ParamsInput(role);
    this.setAttributes({ for: role });
    this.append(this.input);
  }
}
