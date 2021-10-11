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

export class ValueLabel extends BaseComponent {
  role = FORM.getRole();

  action: string;

  params: IActionParams;

  constructor(action: [string, IActionParams]) {
    super(Tags.LABEL, ['method__label', 'custom-radio']);
    this.action = action[0];
    this.params = this.paramsObjectCreator(action[1]);

    const title = new BaseComponent(Tags.DIV, ['method__label-title']);
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    const methodAction = new BaseComponent(Tags.DIV, ['action__place']);
    const requestBlock = new BaseComponent(Tags.DIV);
    const span = new BaseComponent(Tags.SPAN);

    span.innerHTML = this.action;
    arrowDown.innerHTML = `${SVG.iconArrowDown}`;
    this.setAttributes({ for: span.innerHTML });

    this.element.addEventListener('click', this.actionMenuListener);

    requestBlock.append(
      new Params(action[1], this.setParamsValue),
      new Submit(this.action, this.getArgs)
    );
    methodAction.append(
      requestBlock,
      new OutputPlace(this.action)
    );
    title.append(new ValueInput(action), span, arrowDown);
    this.append(title, methodAction);
  }

  actionMenuListener = (e: Event):void => {
    const target = e.target as HTMLElement;
    if (target.closest('.method__label-title')) {
      this.classList.toggle('active');
    }
  };

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
