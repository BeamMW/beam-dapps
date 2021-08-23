import { IOutput, IActionParams } from 'beamApiProps';
import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent, {
  InformArgs,
  IObserverFormComponent
} from '../../../../../../BaseComponent/base.component';
import { ParamsLabel } from './label.component';

export class Params extends BaseComponent {
  role: string;

  action: string;

  constructor(
    output:IOutput,
    role:string,
    action:string,
    observer: (observer: IObserverFormComponent) => void
  ) {
    super(Tags.DIV, ['input__params']);
    observer(this);
    this.role = role;
    this.action = action;
    this.render(output);
  }

  inform = ({ currentRole, currentAction, output }:InformArgs):void => {
    this.role = currentRole;
    this.action = currentAction;
    this.render(output);
  };

  render = (output:IOutput):void => {
    this.element.innerHTML = '';
    const title = new BaseComponent(Tags.DIV, ['params-title']);
    title.element.innerText = 'Params: ';
    const actions = Object.entries(
      output.roles[this.role]?.[this.action] as IActionParams
    );
    const valuesList = actions.map((el) => new ParamsLabel(el));
    if (valuesList.length) this.append(title, ...valuesList);
  };
}
