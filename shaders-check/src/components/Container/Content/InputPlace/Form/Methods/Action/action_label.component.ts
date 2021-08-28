import { IActionParams } from 'beamApiProps';
import { FormDispatch } from 'formProps';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { ValueInput } from './action_input.component';

export class ValueLabel extends BaseComponent {
  input: ValueInput;

  constructor(
    action:[string, IActionParams],
    currentAction:string,
    dispatch:FormDispatch
  ) {
    super(Tags.LABEL, ['method__label', 'custom-radio']);
    this.input = new ValueInput(action, currentAction, dispatch);
    const span = new BaseComponent(Tags.SPAN);
    span.element.innerText = action[0] as string;
    this.setAttributes({ for: span.element.innerText });
    this.append(this.input, span);
  }
}
