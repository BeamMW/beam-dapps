import { IRoleOutput } from 'beamApiProps';
import {
  IObserverFormComponent
} from '../components/BaseComponent/base.component';
import { FormActions } from '../constants/variables';

export class FormApi {
  roleOutput: IRoleOutput;

  observers: IObserverFormComponent[];

  currentRole: string;

  currentAction: string;

  constructor(roleOutput:IRoleOutput) {
    this.roleOutput = roleOutput;
    this.observers = [];
    const roles = Object.entries(this.roleOutput.roles as IRoleOutput);
    const actions = Object.keys(roles[0]?.[1]);
    this.currentRole = roles[0]?.[0] as string;
    this.currentAction = actions[0] as string;
    // this.element.addEventListener('submit', this.onSubmit);
  }

  addObserver = (element:IObserverFormComponent):void => {
    this.observers.push(element);
  };

  notifyAll = ():void => this.observers.forEach((subs) => subs.inform(
    {
      currentAction: this.currentAction,
      currentRole: this.currentRole,
      roleOutput: this.roleOutput
    }
  ));

  dispatch = (obj: any):void => {
    this.reducer(obj);
  };

  reducer = (obj: { action: FormActions; payload: any; }):void => {
    const { action } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        this.currentRole = obj.payload;
        this.currentAction = Object.keys(
          this.roleOutput.roles[this.currentRole]
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
