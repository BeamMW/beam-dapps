import { IOutput } from 'beamApiProps';
import { FormApi } from '../../../../../logic/form/form.logic';
import BaseComponent from '../../../../shared/base/base.component';
import { Tags } from '../../../../../constants/html_elements';
import { Value } from './Methods/Action/action_value.component';
import { Params } from './Methods/Params/params_value.component';
import { Role } from './Methods/Role/role_value.component';
import { Submit } from './Methods/Submit/submit.component';
import { FORM } from '../../../../controllers/form.controller';

export class Form extends BaseComponent {
  role: Role;

  action: BaseComponent;

  params: Params;

  output: IOutput;

  submit: Submit;

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
    const role = new Role(this.output);
    this.action = new BaseComponent(Tags.DIV, ['action-params']);
    this.action.append(new Value(this.output, FORM.getRole()));
    // const submit = new Submit();
    this.append(role, this.action);
    this.element.addEventListener('submit', (e:Event) => {
      e.preventDefault();
    });
  }

  informForm = (role:string):void => {
    this.action.removeAll();
    this.action.append(new Value(
      this.output, role
    ));
  };
}
