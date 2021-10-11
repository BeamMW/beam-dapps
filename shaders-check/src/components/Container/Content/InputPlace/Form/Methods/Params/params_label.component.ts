import { ParamPayloadArgsType } from 'formProps';
import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../shared/base/base.component';
import { ParamsInput } from './params_input.component';

export class ParamsLabel extends BaseComponent {
  input: ParamsInput;

  constructor(
    role:string,
    callback: (obj:ParamPayloadArgsType) => void
  ) {
    super(Tags.LABEL, ['params__label']);
    this.input = new ParamsInput(role, callback);
    this.textContent = `${role}`;
    this.setAttributes({ for: role });
    this.append(this.input);
  }
}
