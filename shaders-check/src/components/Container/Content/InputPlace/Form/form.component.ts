import { IOutput } from 'beamApiProps';
import { FormApi } from '../../../../../utils/args_reducer';
import BaseComponent from '../../../../BaseComponent/base.component';
import { Tags } from '../../../../../constants/html_elements';
import { Value } from './Methods/Action/action_value.component';
import { Params } from './Methods/Params/params_value.component';
import { Role } from './Methods/Role/role_value.component';
import { Submit } from './Methods/Submit/submit.component';

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
      addObserver
    );
    const actionParamsWrapper = new BaseComponent(Tags.DIV, ['action-params']);
    actionParamsWrapper.append(action, params);
    const submit = new Submit();
    this.append(submit, role, actionParamsWrapper);
    this.element.addEventListener('submit', (e:Event) => {
      e.preventDefault();
      this.onSubmit(getArgs());
    });
  }

  onSubmit = (args:string):void => {
    console.log(args);
    // const args = [];

    // Utils.getById('output__place').innerHTML = 'loading...';
    // Array.prototype.find.call(
    //   this.role.element.querySelectorAll('.roles__input'),
    //   el => el.checked && args.push(`role=${el.id}`)
    // );
    // Array.prototype.find.call(
    //   this.action.element.querySelectorAll('.method__input'),
    //   el => el.checked && args.push(`action=${el.id}`)
    // );
    // Array.prototype.forEach.call(
    //   this.params.element.querySelectorAll('.params__input'),
    //   el => el.value.length && args.push(`${el.id}=${el.value}`)
    // );
    // Utils.callApi('allMethods-view', 'invoke_contract', {
    //   create_tx: false,
    //   contract: Array.from(new Uint8Array(this.shader)),
    //   args: args.join(',')
    // });
  };
}
