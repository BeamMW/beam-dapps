import { IActionParams, ParamPayloadArgsType } from '@alltypes';
import { ParamsInput } from '@components/shared';
import { argsStringify } from '@utils/string-handlers';
import Observer from './observer';

class ActionLogic extends Observer<IActionParams> {
  public role: string | null;

  public action: string;

  public params: IActionParams;

  constructor([role, action, params]: [string | null, string, IActionParams]) {
    super();
    this.role = role;
    this.action = action;
    this.params = this.paramsObjectCreator(Object.keys(params));
  }

  readonly subscribe = (component: ParamsInput): void => {
    this.attach(component.valueChanger);
    const listener = this.subscribeListener(component);
    component.element.addEventListener('input', listener);
    component.listener = listener;
  };

  readonly clearParamsHandler = (
    keys: string[],
    callback: (bool: boolean) => void
  ): void => {
    this.params = this.paramsObjectCreator(keys);
    if (callback) callback(false);
    this.notifyAll(this.params);
  };

  readonly getArgs = (): string => {
    const args: { [key: string]: string } = {
      action: this.action,
      ...this.params
    };
    if (this.role) {
      args.role = this.role;
    }
    return argsStringify(args);
  };

  private readonly setParamsValue = (payload: ParamPayloadArgsType): void => {
    this.params[payload.key] = payload.value;
  };

  subscribeListener =
  (component: ParamsInput,
    callback?: (bool: boolean) => void) => (e: Event): void => {
    const target = <HTMLInputElement>e.target;
    this.setParamsValue({
      key: component.param,
      value: target.value
    });
    const values = Object.values(this.params);
    this.notifyAll(this.params);
    if (callback) callback(values.findIndex((el) => el.length) !== -1);
  };

  readonly paramsObjectCreator = (params: string[]): IActionParams => {
    const obj = {};
    params.forEach((param) => {
      Object.defineProperty(obj, param, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: ''
      });
    });
    return obj;
  };
}

export default ActionLogic;
