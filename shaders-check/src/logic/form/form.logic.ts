import {
  IOutput,
  DeleteObserverType
} from 'beamApiProps';
import {
  AddObsever,
  FormDispatch,
  IFormState
} from 'formProps';
import BaseComponent from '../../components/shared/base/base.component';
import { FormActions } from '../../constants/variables';
import { ActionTypes } from './action_creators';

const initialState: IFormState = {
  role: null,
  onload: new Set()
};

export class FormApi {
  private readonly output: IOutput;

  private readonly observers: Set<BaseComponent>;

  private state: IFormState = { ...initialState };

  constructor(output: IOutput) {
    this.output = output;
    this.observers = new Set();
    if (this.output.roles) {
      const roles = Object.entries(this.output.roles);
      this.state.role = roles[0]?.[0] as string;
    }
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
      subs.informForm(this.state);
    }
  });

  dispatch: FormDispatch = (obj): void => {
    setTimeout(() => {
      this.reducer(obj);
      this.notifyAll();
    });
  };

  getRole = ():IFormState => this.state;

  reducer = (obj: ActionTypes): void => {
    const newState = {
      ...this.state, onload: new Set(this.state.onload)
    };
    const { action, payload } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        newState.role = payload;
        break;
      case FormActions.SET_ONLOAD:
        newState.onload.add(payload);
        break;
      case FormActions.DELETE_ONLOAD:
        newState.onload.delete(payload);
        break;
      default:
        break;
    }
    this.state = newState;
  };
}
