import { IOutput, IActionOutput } from 'beamApiProps';
import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { ValueLabel } from './action_label.component';
import './action.scss';

export class Value extends BaseComponent {
  action: string;

  role: string;

  constructor(
    output: IOutput,
    role: string
  ) {
    super(Tags.DIV, ['input__action-radio']);
    this.role = role;
    this.render(output);
  }

  informForm = (role:string):void => {
    console.log(role);
    // if (formAction === FormActions.SET_ROLE
    //   || formAction === FormActions.SET_ACTION) {
    //   this.role = currentRole;
    //   this.action = currentAction;
    //   this.render(output);
    // }
  };

  render = (output: IOutput):void => {
    this.element.innerHTML = '';
    // const title = new BaseComponent(Tags.DIV, ['action-title']);
    // title.element.innerText = 'Action: ';
    const actions = Object.entries(output.roles[this.role] as IActionOutput);
    const valuesList = actions.map(
      (el) => new ValueLabel(el, this.action)
    );
    this.append(...valuesList);
  };
}
