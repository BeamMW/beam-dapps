import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { RoleLabel } from './label.component';

export class Role extends BaseComponent {
  constructor(obj:any, dispatch:any) {
    super(Tags.DIV, ['input__role']);
    this.element.innerText = 'Role: ';
    const roles = Object.entries(obj.roles);
    roles.forEach((el, i) => {
      this.append(new RoleLabel(el, dispatch, i));
    });
  }
}
