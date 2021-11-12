import { IOutput } from '@alltypes';
import { BaseComponent, RoleInput } from '@components/shared';
import { Tags } from '@constants/html-elements';
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
