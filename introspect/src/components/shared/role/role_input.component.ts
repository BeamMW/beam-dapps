import { AC } from '../../../logic/store/action_creators';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import { STORE } from '../../../controllers/store.controller';

export class RoleInput extends BaseComponent {
  constructor(role:[string, unknown], index:number) {
    super(Tags.INPUT, ['roles__input', `role-${role[0]}`]);

    (this.element as HTMLInputElement).checked = !index;
    this.setAttributes({
      id: <string>role[0],
      type: 'radio',
      name: 'role'
    });

    this.element.addEventListener('change', (e:Event) => {
      if ((e.target as HTMLInputElement).checked) {
        STORE.dispatch(AC.setRole(this.element.id));
      }
    });
  }
}
