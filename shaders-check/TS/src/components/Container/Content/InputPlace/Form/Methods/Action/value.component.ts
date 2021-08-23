import { IOutput, IActionOutput } from 'beamApiProps';
import BaseComponent, {
  AddObsever,
  FormDispatch,
  InformArgs
} from '../../../../../../BaseComponent/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { ValueLabel } from './label.component';

export class Value extends BaseComponent {
  action: string;

  role: string;

  constructor(
    output: IOutput,
    role: string,
    action: string,
    dispatch: FormDispatch,
    observe: AddObsever
  ) {
    super(Tags.DIV, ['input__action-radio']);
    observe(this);
    this.role = role;
    this.action = action;
    this.render(output, dispatch);
  }

  inform = ({
    currentRole,
    currentAction,
    output,
    dispatch
  }: InformArgs):void => {
    this.role = currentRole;
    this.action = currentAction;
    this.render(output, dispatch);
  };

  render = (output: IOutput, dispatch: FormDispatch):void => {
    this.element.innerHTML = '';
    const title = new BaseComponent(Tags.DIV, ['action-title']);
    title.element.innerText = 'Action: ';
    const actions = Object.entries(output.roles[this.role] as IActionOutput);
    const valuesList = actions.map(
      (el) => new ValueLabel(el, this.action, dispatch)
    );
    this.append(title, ...valuesList);
  };
}
