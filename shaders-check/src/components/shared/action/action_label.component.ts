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
import { STORE } from '../../../controllers/store.controller';
import {
  OutputPlace
} from '../output/output_place.component';
import { ValueInput } from './action_input.component';
import { Clear } from '../clear/clear.component';
import { ParamsInput } from '../params/params_input.component';
import { actionColors } from './action.data';

export class ValueLabel extends BaseComponent {
  role = STORE.getState().role;

  private readonly observers: Set<ParamsInput>;

  private readonly action: string;

  private params: IActionParams;

  private readonly clear: Clear;

  private readonly submit: Submit;

  methodAction: BaseComponent;

  constructor(action: [string, IActionParams], index: number) {
    super(Tags.LABEL, ['method__label', `action-${action[0]}`]);
    this.action = action[0];
    const keys = Object.keys(action[1]);
    this.params = this.paramsObjectCreator(keys);
    this.observers = new Set();

    const title = new BaseComponent(Tags.DIV, ['method__label-title']);
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    this.methodAction = new BaseComponent(Tags.DIV, ['action__place']);
    const requestBlock = new BaseComponent(Tags.DIV, ['action__request']);
    const span = new BaseComponent(Tags.SPAN);
    const buttons = new BaseComponent(Tags.DIV, ['buttons']);
    this.clear = new Clear(this.action);
    this.submit = new Submit(this.action, this.getArgs);

    span.innerHTML = this.action;
    arrowDown.innerHTML = `${SVG.iconArrowDown}`;
    this.setAttributes({ for: span.innerHTML });

    this.style.background = index < actionColors.length
      ? <string>actionColors[index]
      : <string>actionColors[
        (index - actionColors.length) / (
          Math.floor(index / actionColors.length)
        )
      ];
    requestBlock.style.paddingTop = keys.length ? '14px' : '46px';

    this.element.addEventListener('click', this.actionMenuListener);
    this.clear.element.addEventListener('click', () => {
      this.params = this.paramsObjectCreator(keys);
      this.setActiveButton(false);
      this.notifyAll();
    });

    buttons.append(this.clear, this.submit);
    requestBlock.append(
      new Params(
        action[1],
        this.addObserver
      ), buttons
    );
    this.methodAction.append(
      requestBlock,
      new OutputPlace(this.action)
    );
    title.append(
      new ValueInput(action),
      span, arrowDown
    );
    this.append(title, this.methodAction);
  }

  actionMenuListener = (e: Event):void => {
    const target = e.target as HTMLElement;

    if (target.closest('.method__label-title')) {
      this.classList.toggle('active');
      const panel = this.methodAction.element;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = '';
      } else {
        panel.style.maxHeight = `${panel.scrollHeight + 25}px`;
      }
    }
  };

  addObserver = (component: ParamsInput): void => {
    this.observers.add(component);
    component.element.addEventListener('input', (e:Event) => {
      const target = e.target as HTMLInputElement;
      this.setParamsValue({
        key: component.param,
        value: target.value
      });
      const values = Object.values(this.params);
      this.notifyAll();
      this.setActiveButton(values.findIndex((el) => el.length) !== -1);
    });
  };

  setActiveButton = (isActive: boolean):void => {
    if (isActive) {
      this.clear.classList.add('active');
    } else {
      this.clear.classList.remove('active');
    }
  };

  notifyAll = (): void => this.observers.forEach((subs) => {
    subs.valueChanger(this.params);
  });

  paramsObjectCreator = (params: string[]): IActionParams => {
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

  setParamsValue = (payload: ParamPayloadArgsType): void => {
    this.params[payload.key] = payload.value;
  };

  argsStringify = (args: {
    [key: string]: string
  }): string => Object.entries(args)
    .filter((arg) => arg[1].length)
    .map((arg) => arg.join('=')).join(',');

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
