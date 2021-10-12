import { IActionParams } from 'beamApiProps';
import { ParamPayloadArgsType } from 'formProps';
import {
  Params
} from '../params/params_value.component';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import { SVG } from '../../../constants/svg.icons';
import {
  Submit
} from '../submit/submit.component';
import { FORM } from '../../../controllers/form.controller';
import {
  OutputPlace
} from '../../output/output_place.component';
import { ValueInput } from './action_input.component';
import { Clear } from '../clear/clear.component';
import { ParamsInput } from '../params/params_input.component';

export class ValueLabel extends BaseComponent {
  role = FORM.getRole();

  action: string;

  params: IActionParams;

  private readonly observers: Set<ParamsInput>;

  clear: Clear;

  submit: Submit;

  constructor(action: [string, IActionParams]) {
    super(Tags.LABEL, ['method__label', 'custom-radio']);
    this.action = action[0];
    this.params = this.paramsObjectCreator(action[1]);
    this.observers = new Set();

    const title = new BaseComponent(Tags.DIV, ['method__label-title']);
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    const methodAction = new BaseComponent(Tags.DIV, ['action__place']);
    const requestBlock = new BaseComponent(Tags.DIV, ['action__request']);
    const span = new BaseComponent(Tags.SPAN);
    const buttons = new BaseComponent(Tags.DIV, ['buttons']);
    this.clear = new Clear();
    this.submit = new Submit(this.action, this.getArgs);

    span.innerHTML = this.action;
    arrowDown.innerHTML = `${SVG.iconArrowDown}`;
    this.setAttributes({ for: span.innerHTML });

    this.element.addEventListener('click', this.actionMenuListener);
    this.clear.element.addEventListener('click', () => {
      this.params = this.paramsObjectCreator(action[1]);
      this.notifyAll();
      this.clear.classList.remove('active');
      this.submit.classList.remove('active');
    });

    buttons.append(this.clear, this.submit);
    requestBlock.append(
      new Params(
        action[1],
        this.addObserver
      ), buttons
    );
    methodAction.append(
      requestBlock,
      new OutputPlace(this.action)
    );
    title.append(
      new ValueInput(action),
      span, arrowDown
    );
    this.append(title, methodAction);
  }

  paramsChanger = (action: string, value:string):void => {
    this.params[action] = value;
    this.notifyAll();
  };

  actionMenuListener = (e: Event):void => {
    const target = e.target as HTMLElement;
    if (target.closest('.method__label-title')) {
      this.classList.toggle('active');
    }
  };

  addObserver = (component: ParamsInput): void => {
    this.observers.add(component);
    this.element.addEventListener('input', (e:Event) => {
      const target = e.target as HTMLInputElement;
      this.setParamsValue({
        key: component.param,
        value: target.value
      });
      const values = Object.values(this.params);

      values.findIndex((el) => console.log(el));

      if (values.findIndex((el) => el.length > 0) !== -1) {
        this.clear.classList.add('active');
        this.submit.classList.add('active');
      } else {
        this.clear.classList.remove('active');
        this.submit.classList.remove('active');
      }
    });
  };

  notifyAll = (): void => this.observers.forEach((subs) => {
    subs.valueChanger(this.params);
  });

  paramsObjectCreator = (params: { [key: string]: string }): IActionParams => {
    const obj = {};
    Object.keys(params).forEach((param) => {
      Object.defineProperty(obj, param, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: ''
      });
    });
    return obj;
  };

  setParamsValue = (payload: ParamPayloadArgsType): void => {
    this.params[payload.key] = payload.value;
  };

  argsStringify = (args: {
    [key: string]: string
  }): string => Object.entries(args)
    .map((arg) => arg.join('='))
    .join(',');

  getArgs = (): string => {
    const args: { [key:string]:string } = {
      action: this.action,
      ...this.params
    };
    if (this.role) {
      args.role = this.role;
    }
    return this.argsStringify(args);
  };
}
