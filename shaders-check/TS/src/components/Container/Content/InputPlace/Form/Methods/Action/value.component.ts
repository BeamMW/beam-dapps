import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { ValueLabel } from './label.component';

export class Value extends BaseComponent {
  action:any;

  role:any;

  constructor(obj:any, role:any, action:any, dispatch:any, observe:any) {
    super(Tags.DIV, ['input__action-radio']);
    observe(this);
    this.role = role;
    this.action = action;
    this.render(obj, dispatch);
  }

  inform = (obj:any) => {
    this.role = obj.currentRole;
    this.action = obj.currentAction;
    this.render(obj.obj, obj.dispatch);
  };

  render = (obj:any, dispatch:(f:any) => any) => {
    this.element.innerHTML = '';
    const title = new BaseComponent(Tags.DIV, ['action-title']);
    title.element.innerText = 'Action: ';
    const actions = Object.entries(obj.roles[this.role]);
    const valuesList = actions.map(
      (el) => new ValueLabel(el, this.action, dispatch)
    );
    this.append(title, ...valuesList);
  };
}
