import { IOutput } from 'beamApiProps';
import { FormDispatch } from 'formProps';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { RoleLabel } from './role_label.component';
import './role.scss';

export class Role extends BaseComponent {
  constructor(obj:IOutput, dispatch:FormDispatch) {
    super(Tags.DIV, ['input__role']);
    // this.element.innerText = 'Role: ';
    const roles = Object.entries(obj.roles);
    roles.forEach((el, i) => {
      this.append(new RoleLabel(el, dispatch, i));
    });
  }
}
