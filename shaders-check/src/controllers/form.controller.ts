import { AddObsever, FormDispatch } from 'formProps';

export class FORM {
  static addObserver: AddObsever;

  static dispatch: FormDispatch;

  static getRole: () => string | null;

  static setApiHandlers = (obj: {
    addObserver: AddObsever,
    dispatch: FormDispatch,
    getRole: () => string | null
  }): void => {
    FORM.addObserver = obj.addObserver;
    FORM.dispatch = obj.dispatch;
    FORM.getRole = obj.getRole;
  };
}