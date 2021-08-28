import { IOutput, IActionOutput } from 'beamApiProps';
import { AddObsever, FormDispatch } from 'formProps';
import BaseComponent from '../components/BaseComponent/base.component';
import { FormActions } from '../constants/variables';
import { ActionTypes } from './action_creators';
import { argsStringify } from './json_handlers';

export class FormApi {
  output: IOutput;

  observers: BaseComponent[];

  currentRole: string;

  currentAction: string;

  constructor(output: IOutput) {
    this.output = output;
    this.observers = [];
    const roles = Object.entries(this.output.roles);
    const actions = Object.keys(roles[0]?.[1] as IActionOutput);
    this.currentRole = roles[0]?.[0] as string;
    this.currentAction = actions[0] as string;
  }

  addObserver: AddObsever = (element): void => {
    this.observers.push(element);
  };

  notifyAll = (): void => this.observers.forEach((subs) => {
    if (subs.informForm) {
      subs.informForm({
        currentAction: this.currentAction,
        currentRole: this.currentRole,
        output: this.output,
        dispatch: this.dispatch
      });
    }
  });

  dispatch: FormDispatch = (obj): void => {
    this.reducer(obj);
  };

  getArgs = ():string => {
    const args = {
      role: this.currentRole,
      action: this.currentAction
    };
    return argsStringify(args);
  };

  reducer = (obj: ActionTypes): void => {
    const { action } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        this.currentRole = obj.payload;
        this.currentAction = Object.keys(
          this.output.roles[this.currentRole] as IActionOutput
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
}
