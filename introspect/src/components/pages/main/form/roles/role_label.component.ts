import { Tags } from '../../../../../constants/html_elements';
import { BaseComponent, RoleInput } from '../../../../shared';

export class RoleLabel extends BaseComponent {
  input: RoleInput;

  constructor([role, actions]:[string, unknown], index:number) {
    super(Tags.LABEL, ['roles__label', `role-${role}`]);
    this.input = new RoleInput([role, actions], index);
    const span = new BaseComponent(Tags.SPAN);
    span.textContent = <string>role;
    const underline = new BaseComponent(Tags.DIV, ['active']);
    this.element.setAttribute('for', <string>role);
    this.append(this.input, span, underline);
  }
}
