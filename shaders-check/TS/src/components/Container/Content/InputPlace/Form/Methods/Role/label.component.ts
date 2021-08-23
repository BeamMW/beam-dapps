import BaseComponent,
{ FormDispatch } from '../../../../../../BaseComponent/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { RoleInput } from './input.component';

export class RoleLabel extends BaseComponent {
  input: RoleInput;

  constructor(role:[string, unknown], dispatch:FormDispatch, index:number) {
    super(Tags.LABEL, ['roles__label', 'custom-radio']);
    this.input = new RoleInput(role, dispatch, index);
    const span = new BaseComponent(Tags.SPAN);
    span.element.innerText = <string>role[0];
    this.element.setAttribute('for', <string>role[0]);
    this.append(this.input, span);
  }
}
