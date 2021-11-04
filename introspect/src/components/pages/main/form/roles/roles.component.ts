import { IOutput } from 'beamApiProps';
import BaseComponent from '../../../../shared/base/base.component';
import { Tags } from '../../../../../constants/html_elements';
import { RoleInput } from '../../../../shared';
import './roles.scss';

class Role extends BaseComponent {
  constructor(obj: IOutput) {
    super(Tags.DIV, ['roles']);
    if (obj.roles) {
      const roles = Object.entries(obj.roles);
      roles.forEach((el, i) => {
        this.append(new RoleInput(el, i));
      });
    }
  }
}

export default Role;
