import { AddObsever, FormDispatch, IFormState } from 'formProps';

export class STORE {
  static addObserver: AddObsever;

  static dispatch: FormDispatch;

  static getState: () => IFormState;

  static setApiHandlers = (obj: {
    addObserver: AddObsever,
    dispatch: FormDispatch,
    getRole: () => IFormState
  }): void => {
    STORE.addObserver = obj.addObserver;
    STORE.dispatch = obj.dispatch;
    STORE.getState = obj.getRole;
  };
}
