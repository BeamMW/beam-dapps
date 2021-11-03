import { IOutput } from 'beamApiProps';
import BaseComponent from '../../../../shared/base/base.component';
import { Tags } from '../../../../../constants/html_elements';
import './roles.scss';
import { RoleLabel } from './role_label.component';

class Role extends BaseComponent {
  constructor(obj: IOutput) {
    super(Tags.DIV, ['roles']);
    if (obj.roles) {
      const roles = Object.entries(obj.roles);
      roles.forEach((el, i) => {
        this.append(new RoleLabel(el, i));
      });
    }
  }
}

export default Role;
