import { IOutput } from 'beamApiProps';
import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { RoleLabel } from './role_label.component';
import './role.scss';

export class Role extends BaseComponent {
  constructor(obj:IOutput) {
    super(Tags.DIV, ['input__role']);
    // this.element.innerText = 'Role: ';
    const roles = Object.entries(obj.roles);
    roles.forEach((el, i) => {
      this.append(new RoleLabel(el, i));
    });
  }
}
