import { Tags } from '../../../../../../../constants/html_elements';
import { setRoleAC } from '../../../../../../../utils/action_creators';
import BaseComponent from '../../../../../../BaseComponent/base.component';

export class RoleInput extends BaseComponent {
  constructor(role:[string, unknown], dispatch:any, index:number) {
    super(Tags.INPUT, ['roles__input']);
    this.element.id = <string>role[0];
    (this.element as HTMLInputElement).checked = !index;
    this.element.setAttribute('type', 'radio');
    this.element.setAttribute('name', 'role');
    this.element.addEventListener('change', (e:Event) => {
      if ((e.target as HTMLInputElement).checked) {
        dispatch(setRoleAC(this.element.id));
      }
    });
  }
}
