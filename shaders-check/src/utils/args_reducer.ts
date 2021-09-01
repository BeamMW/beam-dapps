import {
  IOutput,
  IActionOutput,
  IActionParams,
  DeleteObserverType
} from 'beamApiProps';
import {
  ActionPayloadArgsType,
  AddObsever,
  FormDispatch,
  ParamPayloadArgsType
} from 'formProps';
import BaseComponent from '../components/BaseComponent/base.component';
import { FormActions } from '../constants/variables';
import { ActionTypes } from './action_creators';
import { argsStringify, paramsObjectCreator } from './json_handlers';

export class FormApi {
  private readonly output: IOutput;

  private readonly observers: Set<BaseComponent>;

  currentRole: string;

  currentAction: string;

  currentParams: IActionParams;

  constructor(output: IOutput) {
    this.output = output;
    this.observers = new Set();
    const roles = Object.entries(this.output.roles);
    const actions = Object.keys(roles[0]?.[1] as IActionOutput);
    this.currentRole = roles[0]?.[0] as string;
    this.currentAction = actions[0] as string;
    this.currentParams = paramsObjectCreator(
      this.output.roles?.[this.currentRole]?.[
        this.currentAction
      ] as IActionParams
    );
  }

  addObserver: AddObsever = (element): void => {
    this.observers.add(element);
  };

  deleteObserver:DeleteObserverType = (component: BaseComponent) => {
    console.log(this.observers.size);
    this.observers.delete(component);
  };

  notifyAll = (action:FormActions): void => this.observers.forEach((subs) => {
    if (subs.informForm) {
      subs.informForm({
        formAction: action,
        currentAction: this.currentAction,
        currentRole: this.currentRole,
        currentParams: this.currentParams,
        output: this.output,
        dispatch: this.dispatch,
        addObserver: this.addObserver
      });
    }
  });

  dispatch: FormDispatch = (obj): void => {
    this.reducer(obj);
  };

  getArgs = (): string => {
    const args = {
      role: this.currentRole,
      action: this.currentAction,
      ...this.currentParams
    };
    return argsStringify(args);
  };

  reducer = (obj: ActionTypes): void => {
    const { action, payload } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        this.currentRole = payload as string;
        this.currentAction = Object.keys(
          this.output.roles[this.currentRole] as IActionOutput
        )[0] as string;
        this.currentParams = paramsObjectCreator(
          this.output.roles?.[this.currentRole]?.[
            this.currentAction
          ] as IActionParams
        );
        break;
      case FormActions.SET_ACTION:
        this.currentAction = (payload as ActionPayloadArgsType).action;
        this.currentParams = paramsObjectCreator(
          this.output.roles?.[this.currentRole]?.[
            this.currentAction
          ] as IActionParams
        );
        break;

      case FormActions.SET_PARAM_VALUE:
        this.currentParams[
          (obj.payload as ParamPayloadArgsType).key
        ] = (obj.payload as ParamPayloadArgsType).value;
        break;
      case FormActions.UNSUBSCRIBE:
        this.deleteObserver(payload);
        break;
      default:
        break;
    }
    this.notifyAll(action);
  };
}
