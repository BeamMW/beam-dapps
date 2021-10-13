import { AddObsever, FormDispatch, IFormState } from 'formProps';

export class FORM {
  static addObserver: AddObsever;

  static dispatch: FormDispatch;

  static getState: () => IFormState;

  static setApiHandlers = (obj: {
    addObserver: AddObsever,
    dispatch: FormDispatch,
    getRole: () => IFormState
  }): void => {
    FORM.addObserver = obj.addObserver;
    FORM.dispatch = obj.dispatch;
    FORM.getState = obj.getRole;
  };
}
