import {
  IOutput,
  DeleteObserverType
} from 'beamApiProps';
import {
  AddObsever,
  FormDispatch
} from 'formProps';
import BaseComponent from '../../components/shared/base/base.component';
import { FormActions } from '../../constants/variables';
import { ActionTypes } from './action_creators';

export class FormApi {
  private readonly output: IOutput;

  private readonly observers: Set<BaseComponent>;

  role: string | null = null;

  constructor(output: IOutput) {
    this.output = output;
    this.observers = new Set();
    if (this.output.roles) {
      const roles = Object.entries(this.output.roles);
      this.role = roles[0]?.[0] as string;
    }
    // const actions = Object.keys(roles[0]?.[1] as IActionOutput;
    // this.currentAction = actions[0] as string;
    // this.currentParams = paramsObjectCreator(
    //   this.output.roles?.[this.currentRole]?.[
    //     this.currentAction
    //   ] as IActionParams
    // );
  }

  addObserver: AddObsever = (component): void => {
    this.observers.add(component);
    component.element
      .addEventListener(
        'DOMNodeRemovedFromDocument', () => this.deleteObserver(component)
      );
  };

  deleteObserver:DeleteObserverType = (component: BaseComponent) => {
    this.observers.delete(component);
  };

  notifyAll = (): void => this.observers.forEach((subs) => {
    if (subs.informForm) {
      subs.informForm(this.role);
    }
  });

  dispatch: FormDispatch = (obj): void => {
    this.reducer(obj);
  };

  getRole = ():string | null => this.role;

  reducer = (obj: ActionTypes): void => {
    const { action, payload } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        this.role = payload as string;
        break;
      default:
        break;
    }
    this.notifyAll();
  };
}
