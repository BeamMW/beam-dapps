import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';
import { ParamsInput } from './params_input.component';

export class ParamsLabel extends BaseComponent {
  input: ParamsInput;

  constructor(
    role:string,
    addObserver: (component: ParamsInput) => void
  ) {
    super(Tags.LABEL, ['params__label']);
    this.input = new ParamsInput(role, addObserver);
    this.textContent = `${role}`;
    this.setAttributes({ for: role });
    this.append(this.input);
  }
}
