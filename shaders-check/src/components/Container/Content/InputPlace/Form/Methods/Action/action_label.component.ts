import { IActionParams } from 'beamApiProps';
import { ParamPayloadArgsType } from 'formProps';
import { Params } from '../Params/params_value.component';
import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { ValueInput } from './action_input.component';
import { SVG } from '../../../../../../../constants/svg.icons';
import { Submit } from '../Submit/submit.component';
import { FORM } from '../../../../../../controllers/form.controller';
import { OutputPlace } from '../../../../OutputPlace/output_place.component';

export class ValueLabel extends BaseComponent {
  role = FORM.getRole();

  action:string;

  params: IActionParams;

  constructor(
    action: [string, IActionParams]
  ) {
    super(Tags.LABEL, ['method__label', 'custom-radio']);
    this.action = action[0];
    this.params = this.paramsObjectCreator(action[1]);

    const title = new BaseComponent(Tags.DIV, ['method__label-title']);
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    const methodAction = new BaseComponent(Tags.DIV, ['action__place']);
    const requestBlock = new BaseComponent(Tags.DIV);
    const responseBlock = new OutputPlace(this.action);
    const span = new BaseComponent(Tags.SPAN);
    const submit = new Submit(this.action, this.getArgs);
    const input = new ValueInput(action);

    span.innerHTML = this.action;
    arrowDown.innerHTML = `${SVG.iconArrowDown}`;
    this.setAttributes({ for: span.innerHTML });

    title.element.addEventListener('click', (e) => {
      title.element.classList.toggle('active');
      if (methodAction.style.display === 'flex') {
        methodAction.style.display = '';
      } else {
        methodAction.style.display = 'flex';
      }
      e.preventDefault();
    });

    requestBlock.append(
      new Params(action[1], this.setParamsValue),
      submit
    );
    methodAction.append(
      requestBlock,
      responseBlock
    );
    title.append(input, span, arrowDown);
    this.append(title, methodAction);
  }

  paramsObjectCreator = (params:{
    [key:string] : string
  }):IActionParams => {
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

  setParamsValue = (payload:ParamPayloadArgsType):void => {
    this.params[
      payload.key
    ] = payload.value;
    console.log(this.params);
  };

  argsStringify = (args: {
    [key:string] : string
  }):string => Object.entries(args)
    .map((arg) => arg.join('='))
    .join(',');

  getArgs = (): string => {
    const args = {
      role: this.role,
      action: this.action,
      ...this.params
    };
    return this.argsStringify(args);
  };
}
