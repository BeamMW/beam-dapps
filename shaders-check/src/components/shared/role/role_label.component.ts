import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import { RoleInput } from './role_input.component';

export class RoleLabel extends BaseComponent {
  input: RoleInput;

  constructor(role:[string, unknown], index:number) {
    super(Tags.LABEL, ['roles__label']);
    this.input = new RoleInput(role, index);
    const span = new BaseComponent(Tags.SPAN);
    span.element.innerText = <string>role[0];
    const underline = new BaseComponent(Tags.DIV, ['active']);
    this.element.setAttribute('for', <string>role[0]);
    this.append(this.input, span, underline);
  }
}
