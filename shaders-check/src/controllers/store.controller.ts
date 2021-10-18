import {
  AddObsever, FormDispatch, IFormState, IsObserverType
} from 'formProps';

export class STORE {
  static addObserver: AddObsever;

  static dispatch: FormDispatch;

  static getState: () => IFormState;

  static isStoreObserver: IsObserverType;

  static setApiHandlers = (obj: {
    addObserver: AddObsever,
    dispatch: FormDispatch,
    getRole: () => IFormState,
    isStoreObserver: IsObserverType
  }): void => {
    STORE.addObserver = obj.addObserver;
    STORE.dispatch = obj.dispatch;
    STORE.getState = obj.getRole;
    STORE.isStoreObserver = obj.isStoreObserver;
  };
}
