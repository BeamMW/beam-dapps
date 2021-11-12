import { Tags } from '@constants/html-elements';
import { AC } from '@logic/action-creators';
import { STORE } from '@logic/controllers';
import BaseComponent from '../base/base.component';

export default class RoleInput extends BaseComponent {
  constructor(
    [role]:[string, unknown], index:number
  ) {
    super(Tags.LABEL, ['roles__label', `role-${role}`]);
    const span = new BaseComponent(Tags.SPAN)
      .innerText(<string>role);
    this.setAttributes({ for: <string>role })
      .append(
        this.createRoleInput(role, index),
        span,
        new BaseComponent(Tags.DIV, ['active'])
      );
  }

  createRoleInput = (
    role:string, index:number
  ):BaseComponent => {
    const component = new BaseComponent(
      Tags.INPUT, ['roles__input', `role-${role}`]
    );
    (component.element as HTMLInputElement).checked = !index;
    component.setAttributes({
      id: <string>role,
      type: 'radio',
      name: 'role'
    });
    component.element.addEventListener('change', (e:Event) => {
      if ((e.target as HTMLInputElement).checked) {
        STORE.dispatch(AC.setRole(component.element.id));
      }
    });
    return component;
  };
}
