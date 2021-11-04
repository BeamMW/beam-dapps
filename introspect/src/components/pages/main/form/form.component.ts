import { IActionOutput, IOutput } from 'beamApiProps';
import { IFormState } from 'formProps';
import { Tags } from '../../../../constants/html_elements';
import { AC } from '../../../../logic/store/action-creators';
import Action from './action/action.component';
import Role from './roles/roles.component';
import { STORE } from '../../../../controllers';
import { BaseComponent } from '../../../shared';

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

    this.action.append(...this.actionsRender(this.output));
    this.append(role, this.action);
  }

  setRole = (output: IOutput | string | null): string | null => {
    if (output && typeof output === 'object') {
      if (output.roles) {
        const roles = Object.entries(output.roles);
        return roles[0]?.[0] as string;
      }
      return null;
    }
    return output;
  };

  actionsRender = (output: IOutput): Action[] => {
    const actions = Object.entries(
      this.roleValue
        ? <IActionOutput>output.roles?.[this.roleValue]
        : output
    );
    return actions.map((el, i) => new Action(el, i));
  };

  informForm = (state: IFormState): void => {
    if (state.role !== this.roleValue) {
      this.roleValue = this.setRole(state.role);
      this.action.removeAll();
      this.action.append(...this.actionsRender(this.output));
    }
  };
}
