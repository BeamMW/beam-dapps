import { IOutput } from 'beamApiProps';
import { IFormState } from 'formProps';
import { FormApi } from '../../logic/form/form.logic';
import BaseComponent from '../shared/base/base.component';
import { Tags } from '../../constants/html_elements';
import { Value } from '../shared/action/action_value.component';
import { Role } from '../shared/role/role_value.component';
import { FORM } from '../../controllers/form.controller';

export class Form extends BaseComponent {
  action: BaseComponent;

  role: string | null;

  output: IOutput;

  constructor(output: IOutput) {
    super(Tags.FORM, ['form']);
    this.output = output;
    const formApi = new FormApi(output);
    FORM.setApiHandlers({
      addObserver: formApi.addObserver,
      dispatch: formApi.dispatch,
      getRole: formApi.getRole
    });
    FORM.addObserver(this);
    this.role = FORM.getState().role;
    const role = new Role(this.output);
    this.action = new BaseComponent(Tags.DIV, ['action-params']);
    this.action.append(new Value(this.output, FORM.getState().role));
    this.append(role, this.action);
    this.element.addEventListener('submit', (e:Event) => {
      e.preventDefault();
    });
  }

  informForm = (state: IFormState):void => {
    if (state.role !== this.role) {
      this.role = state.role;
      this.action.removeAll();
      this.action.append(new Value(
        this.output, state.role
      ));
    }
  };
}
