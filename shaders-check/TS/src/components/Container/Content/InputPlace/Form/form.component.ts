import { IRoleOutput } from 'beamApiProps';
import BaseComponent,
{ IObserverFormComponent } from '../../../../BaseComponent/base.component';
import { Tags } from '../../../../../constants/html_elements';
import { Value } from './Methods/Action/value.component';
import { Params } from './Methods/Params/value.component';
import { Role } from './Methods/Role/value.component';
import { Submit } from './Methods/Submit/submit.component';
import { FormActions } from '../../../../../constants/variables';

export class Form extends BaseComponent {
  obj: IRoleOutput;

  observers: IObserverFormComponent[];

  currentAction: string;

  role: Role;

  currentRole: string;

  action: Value;

  params: Params;

  submit: Submit;

  constructor(obj: IRoleOutput) {
    super(Tags.FORM, ['form']);
    this.obj = obj;
    this.observers = [];
    const roles = Object.entries(this.obj.roles as IRoleOutput);
    const actions = Object.keys(roles[0]?.[1]);
    this.currentRole = roles[0]?.[0] as string;
    this.currentAction = actions[0] as string;
    this.role = new Role(this.obj, this.dispatch);
    this.action = new Value(
      this.obj,
      this.currentRole,
      this.currentAction,
      this.dispatch,
      this.addObserver
    );
    this.params = new Params(
      this.obj,
      this.currentRole,
      this.currentAction,
      this.addObserver
    );
    const actionParamsWrapper = new BaseComponent(Tags.DIV, ['action-params']);
    actionParamsWrapper.append(this.action, this.params);
    this.submit = new Submit();
    this.append(this.submit, this.role, actionParamsWrapper);
    // this.element.addEventListener('submit', this.onSubmit);
  }

  addObserver = (element:IObserverFormComponent):void => {
    this.observers.push(element);
  };

  notifyAll = () => this.observers.forEach((subs) => subs.inform(this));

  dispatch = (obj: any) => {
    this.reducer(obj);
  };

  reducer = (obj: { action: any; payload: any; }) => {
    const { action } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        this.currentRole = obj.payload;
        this.currentAction = Object.keys(
          this.obj.roles[this.currentRole]
        )[0] as string;
        break;
      case FormActions.SET_ACTION:
        this.currentAction = obj.payload;
        break;
      default:
        break;
    }
    this.notifyAll();
  };

  // onSubmit = (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
  //   const args = [];
  //   Utils.getById('output__place').innerHTML = 'loading...';
  //   Array.prototype.find.call(
  //     this.role.element.querySelectorAll('.roles__input'),
  //     el => el.checked && args.push(`role=${el.id}`)
  //   );
  //   Array.prototype.find.call(
  //     this.action.element.querySelectorAll('.method__input'),
  //     el => el.checked && args.push(`action=${el.id}`)
  //   );
  //   Array.prototype.forEach.call(
  //     this.params.element.querySelectorAll('.params__input'),
  //     el => el.value.length && args.push(`${el.id}=${el.value}`)
  //   );
  //   Utils.callApi('allMethods-view', 'invoke_contract', {
  //     create_tx: false,
  //     contract: Array.from(new Uint8Array(this.shader)),
  //     args: args.join(',')
  //   });
  // };
}
