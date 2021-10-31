import { IActionParams } from 'beamApiProps';
import { ParamPayloadArgsType } from 'formProps';
import { Params } from '../params/params_value.component';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import { STORE } from '../../../controllers/store.controller';
import { OutputPlace } from '../output/output_place.component';
import { ParamsInput } from '../params/params_input.component';
import { actionColors } from '../../../locales/action.data';
import { argsStringify, toDOMParser } from '../../../utils/json_handlers';
import { Button } from '../button/button.component';
import { BEAM } from '../../../controllers/beam.controller';
import { RC } from '../../../logic/beam/request-creators';
import { AC } from '../../../logic/store/action-creators';
import { buttonsData } from '../../../locales/buttons.data';
import { SVG } from '../../../constants/svg.icons';

export class ValueLabel extends BaseComponent {
  role = STORE.getState().role;

  private readonly observers: Set<ParamsInput> = new Set();

  private readonly activeListeners: Button[] = [];

  private readonly action: string;

  private params: IActionParams;

  constructor([action, params]: [string, IActionParams], index: number) {
    super(Tags.DIV, ['method__label', `action-${action}`]);
    this.action = action;
    this.params = this.paramsObjectCreator(Object.keys(params));
    const title = this.createTitleBlock([action, params]);
    const component = this.createActionBlock([action, params]);

    this.style.background = this.actionColor(index);

    this.element.addEventListener(
      'click', (e: Event) => this.actionMenuHandler(e, component)
    );

    this.append(title, component);
  }

  private readonly notifyAll = (): void => this.observers.forEach((subs) => {
    subs.valueChanger(this.params);
  });

  private readonly subscribe = (component: ParamsInput): void => {
    this.observers.add(component);
    const listener = this.subscribeListener(component);
    component.element.addEventListener('input', listener);
    component.listener = listener;
  };

  subscribeListener =
  (component: ParamsInput) => (e: Event): void => {
    const target = <HTMLInputElement>e.target;
    this.setParamsValue({
      key: component.param,
      value: target.value
    });
    const values = Object.values(this.params);
    this.notifyAll();
    this.setActiveButton(values.findIndex((el) => el.length) !== -1);
  };

  readonly actionColor = (index: number): string => (index < actionColors.length
    ? <string>actionColors[index]
    : <string>(
          actionColors[
            (index - actionColors.length)
              / Math.floor(index / actionColors.length)
          ]
        ));

  private readonly paramsObjectCreator = (params: string[]): IActionParams => {
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

  private readonly clearParamsHandler = (keys: string[]): void => {
    this.params = this.paramsObjectCreator(keys);
    this.setActiveButton(false);
    this.notifyAll();
  };

  private readonly submitHandler = (action: string): void => {
    BEAM.callApi(RC.submitResult(action, this.getArgs()));
    STORE.dispatch(AC.setOnload(action));
  };

  private readonly actionMenuHandler = (
    e: Event,
    component: BaseComponent
  ): void => {
    const target = e.target as HTMLElement;
    if (target.closest('.method__label-title')) {
      this.classList.toggle('active');
      if (component.style.maxHeight) {
        component.style.maxHeight = '';
      } else {
        component.style.maxHeight = `${component.element.scrollHeight + 20}px`;
      }
    }
  };

  private readonly setActiveButton = (isActive: boolean): void => {
    this.activeListeners.forEach((button) => {
      if (isActive) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  };

  private readonly createTitleBlock = ([action]: [
    string,
    IActionParams
  ]): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['method__label-title']);
    const span = new BaseComponent(Tags.SPAN);
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    span.textContent = action;
    arrowDown.append(toDOMParser(SVG.iconArrowDown));
    component.append(span, arrowDown);
    return component;
  };

  private readonly createActionBlock = ([action, params]: [
    string,
    IActionParams
  ]): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['action__place']);
    const inner = this.createRequestBlock([action, params]);
    component.append(inner, new OutputPlace(action, this.subscribe));
    return component;
  };

  private readonly createRequestBlock = ([key, value]: [
    string,
    IActionParams
  ]): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['action__request']);
    const params = Object.keys(value);
    component.style.paddingTop = params.length ? '34px' : '62px';
    component.append(
      new Params(value, this.subscribe),
      this.createButtonsBlock(key, params)
    );
    return component;
  };

  private readonly createButtonsBlock = (
    action: string,
    keys: string[]
  ): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['buttons']);
    const [clear, submit] = buttonsData.map(
      (btn) => new Button({
        ...btn,
        action
      })
    );
    clear?.addEventListener('click', () => this.clearParamsHandler(keys));
    submit?.addEventListener('click', () => this.submitHandler(action));
    this.activeListeners.push(clear as Button);
    if (clear && submit) component.append(clear, submit);
    return component;
  };
}
