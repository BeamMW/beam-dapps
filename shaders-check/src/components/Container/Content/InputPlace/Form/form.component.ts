import { IOutput } from 'beamApiProps';
import { BEAM } from '../../../../../utils/api_handlers';
import { FormApi } from '../../../../../utils/args_reducer';
import BaseComponent from '../../../../BaseComponent/base.component';
import { Tags } from '../../../../../constants/html_elements';
import { Value } from './Methods/Action/action_value.component';
import { Params } from './Methods/Params/params_value.component';
import { Role } from './Methods/Role/role_value.component';
import { Submit } from './Methods/Submit/submit.component';
import { RC } from '../../../../../utils/request_creators';

export class Form extends BaseComponent {
  role: Role;

  action: Value;

  params: Params;

  submit: Submit;

  constructor(output: IOutput) {
    super(Tags.FORM, ['form']);
    const formApi = new FormApi(output);
    const {
      currentRole,
      currentAction,
      dispatch,
      addObserver,
      getArgs
    } = formApi;
    const role = new Role(output, dispatch);
    const action = new Value(
      output,
      currentRole,
      currentAction,
      dispatch,
      addObserver
    );
    const params = new Params(
      output,
      currentRole,
      currentAction,
      dispatch,
      addObserver
    );
    const actionParamsWrapper = new BaseComponent(Tags.DIV, ['action-params']);
    actionParamsWrapper.append(action);
    const submit = new Submit();
    this.append(role, actionParamsWrapper, params);
    this.element.addEventListener('submit', (e:Event) => {
      e.preventDefault();
      BEAM.callApi(RC.submitResult(getArgs()));
    });
  }
}
