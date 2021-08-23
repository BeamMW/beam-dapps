import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { ValueInput } from './input.component';

export class ValueLabel extends BaseComponent {
  input: ValueInput;

  constructor(action:any, currentAction:any, dispatch:any) {
    super(Tags.LABEL, ['method__label', 'custom-radio']);
    this.input = new ValueInput(action, currentAction, dispatch);
    const span = new BaseComponent(Tags.SPAN);
    span.element.innerText = action[0];
    this.setAttributes({ for: action[0] });
    this.append(this.input, span);
  }
}
