import { IOutput, IActionOutput } from 'beamApiProps';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import './action.scss';
import { ValueLabel } from './action_label.component';

export class Value extends BaseComponent {
  role: string | null;

  constructor(
    output: IOutput,
    role: string | null
  ) {
    super(Tags.DIV, ['input__action-radio']);
    this.role = role;
    this.render(output);
  }

  render = (output: IOutput):void => {
    this.removeAll();
    const actions = Object.entries(
      this.role
        ? output?.roles?.[this.role] as IActionOutput
        : output
    );
    const valuesList = actions.map(
      (el, i) => new ValueLabel(el, i)
    );
    this.append(...valuesList);
  };
}