import { BaseComponent } from '@components/shared';
import { FormActions } from '@constants/app-shader';
import { AddObsever, FormDispatch, IFormState } from '@alltypes';
import Observer from './observer';
import { ActionTypes } from '../action-creators/action-creators';

const txs = localStorage.getItem('txs');

const initialState: IFormState = {
  role: null,
  onload: new Set(),
  fileName: '',
  defaultCid: null,
  txs: txs ? new Map(JSON.parse(txs)) : new Map(),
  error: {
    msg: '',
    code: null,
    data: ''
  }
};

export default class Store extends Observer<IFormState> {
  private state: IFormState = { ...initialState };

  subscribe: AddObsever = (component: BaseComponent): void => {
    if (component.informForm) {
      this.attach(component.informForm);
      component.element
        .addEventListener(
          'DOMNodeRemovedFromDocument',
          () => component.informForm
          && this.deleteSubscriber(component.informForm)
        );
    }
  };

  readonly isStoreObserver = (
    component: BaseComponent
  ):boolean => {
    if (component.informForm) return this.observers.has(component.informForm);
    return false;
  };

  dispatch: FormDispatch = (obj, sync): void => {
    if (sync) this.reducer(obj);
    else setTimeout(() => this.reducer(obj));
  };

  getRole = ():IFormState => this.state;

  reducer = (obj: ActionTypes): void => {
    const newState = {
      ...this.state,
      onload: new Set(this.state.onload),
      txs: new Map(this.state.txs)
    };
    const { action, payload } = obj;
    switch (action) {
      case FormActions.SET_ROLE:
        newState.role = payload as string;
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

      case FormActions.SET_TXS:
        newState.txs.set(
          (<{ key:string, value:string }>payload).key,
          (<{ key:string, value:string }>payload).value
        );
        break;

      case FormActions.SET_DEFAULT_CID:
        newState.defaultCid = <string>payload;
        break;

      case FormActions.REMOVE_TXS:
        newState.txs.delete(
          payload as string
        );
        break;
      case FormActions.SET_ERROR:
        newState.error = {
          ...payload as {
            msg: string; code: number | null; data: string
          }
        };
        break;

      default:
        break;
    }

    localStorage.setItem('txs', JSON.stringify(Array.from(newState.txs)));
    this.state = newState;
    this.notifyAll(this.state);
  };
}
