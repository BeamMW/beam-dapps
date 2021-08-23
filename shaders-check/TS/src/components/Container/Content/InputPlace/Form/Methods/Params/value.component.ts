import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent, {
  IObserverFormComponent
} from '../../../../../../BaseComponent/base.component';
import { ParamsLabel } from './label.component';

export class Params extends BaseComponent {
  role: any;

  action: string;

  constructor(
    obj:any,
    role:any,
    action:string,
    observer: (observer: IObserverFormComponent) => void
  ) {
    super(Tags.DIV, ['input__params']);
    observer(this);
    this.role = role;
    this.action = action;
    this.render(obj);
  }

  inform = (obj:any):void => {
    this.role = obj.currentRole;
    this.action = obj.currentAction;
    this.render(obj.obj);
  };

  render = (obj:any):void => {
    this.element.innerHTML = '';
    const title = new BaseComponent(Tags.DIV, ['params-title']);
    title.element.innerText = 'Params: ';
    const actions = Object.entries(obj.roles[this.role][this.action]);
    const valuesList = actions.map((el) => new ParamsLabel(el));
    if (valuesList.length) this.append(title, ...valuesList);
  };
}
