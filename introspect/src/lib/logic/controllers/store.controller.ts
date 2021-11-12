import {
  AddObsever, FormDispatch, IFormState, IsObserverType
} from '@alltypes';

export default class STORE {
  static subscribe: AddObsever;

  static dispatch: FormDispatch;

  static getState: () => IFormState;

  static isStoreObserver: IsObserverType;

  static setApiHandlers = (obj: {
    subscribe: AddObsever,
    dispatch: FormDispatch,
    getRole: () => IFormState,
    isStoreObserver: IsObserverType
  }): void => {
    STORE.subscribe = obj.subscribe;
    STORE.dispatch = obj.dispatch;
    STORE.getState = obj.getRole;
    STORE.isStoreObserver = obj.isStoreObserver;
  };
}
