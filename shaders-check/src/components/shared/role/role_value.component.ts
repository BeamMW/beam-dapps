import { IOutput } from 'beamApiProps';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import './role.scss';
import { RoleLabel } from './role_label.component';

export class Role extends BaseComponent {
  constructor(obj: IOutput) {
    super(Tags.DIV, ['input__role']);
    if (obj.roles) {
      const roles = Object.entries(obj.roles);
      roles.forEach((el, i) => {
        this.append(new RoleLabel(el, i));
      });
    }
  }
}
