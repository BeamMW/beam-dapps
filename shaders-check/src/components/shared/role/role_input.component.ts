import { setRoleAC } from '../../../logic/store/action_creators';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import { STORE } from '../../../controllers/store.controller';

export class RoleInput extends BaseComponent {
  constructor(role:[string, unknown], index:number) {
    super(Tags.INPUT, ['roles__input']);
    this.element.id = <string>role[0];
    (this.element as HTMLInputElement).checked = !index;
    this.element.setAttribute('type', 'radio');
    this.element.setAttribute('name', 'role');
    this.element.addEventListener('change', (e:Event) => {
      if ((e.target as HTMLInputElement).checked) {
        STORE.dispatch(setRoleAC(this.element.id));
      }
    });
  }
}
