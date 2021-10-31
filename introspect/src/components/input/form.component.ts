import { IOutput } from 'beamApiProps';
import { IFormState } from 'formProps';
import BaseComponent from '../shared/base/base.component';
import { Tags } from '../../constants/html_elements';
import { Value } from '../shared/action/action_value.component';
import { Role } from '../shared/role/role_value.component';
import { STORE } from '../../controllers/store.controller';
import { AC } from '../../logic/store/action-creators';

export class Form extends BaseComponent {
  action: BaseComponent;

  roleValue: string | null;

  output: IOutput;

  constructor(output: IOutput) {
    super(Tags.FORM, ['form']);
    console.log('output:', output);
    this.output = output;
    STORE.subscribe(this);

    this.roleValue = this.setRole(output);
    STORE.dispatch(AC.setRole(this.roleValue), 'sync');
    this.action = new BaseComponent(Tags.DIV, ['action-params']);
    const role = new Role(this.output);

    this.element.addEventListener('submit', (e: Event) => {
      e.preventDefault();
    });

    this.action.append(new Value(this.output, STORE.getState().role));
    this.append(role, this.action);
  }

  setRole = (output: IOutput | string | null): string | null => {
    if (output && typeof output === 'object') {
      if (output.roles) {
        const roles = Object.entries(output.roles);
        return roles[0]?.[0] as string;
      }
      return null;
    } return output;
  };

  informForm = (state: IFormState): void => {
    if (state.role !== this.roleValue) {
      this.roleValue = this.setRole(state.role);
      this.action.removeAll();
      this.action.append(new Value(this.output, state.role));
    }
  };
}
