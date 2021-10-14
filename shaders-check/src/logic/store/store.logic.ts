import {
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
  onload: new Set(),
  fileName: ''
};

export class Store {
  private readonly observers: Set<BaseComponent>;

  private state: IFormState = { ...initialState };

  constructor() {
    this.observers = new Set();
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

  dispatch: FormDispatch = (obj, sync): void => {
    if (sync) this.reducer(obj);
    else setTimeout(() => this.reducer(obj));
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
        newState.onload.add(payload as string);
        break;
      case FormActions.DELETE_ONLOAD:
        newState.onload.delete(payload as string);
        break;
      case FormActions.SET_FILENAME:
        newState.fileName = payload as string;
        break;
      default:
        break;
    }
    this.state = newState;
    this.notifyAll();
  };
}
