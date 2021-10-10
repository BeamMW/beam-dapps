import { setRoleAC } from '../../../../../../../logic/form/action_creators';
import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { FORM } from '../../../../../../controllers/form.controller';

export class RoleInput extends BaseComponent {
  constructor(role:[string, unknown], index:number) {
    super(Tags.INPUT, ['roles__input']);
    this.element.id = <string>role[0];
    (this.element as HTMLInputElement).checked = !index;
    this.element.setAttribute('type', 'radio');
    this.element.setAttribute('name', 'role');
    this.element.addEventListener('change', (e:Event) => {
      if ((e.target as HTMLInputElement).checked) {
        FORM.dispatch(setRoleAC(this.element.id));
      }
    });
  }
}
