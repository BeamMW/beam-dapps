import { IActionParams } from 'beamApiProps';
import { STORE } from '../../../controllers/store.controller';
import { Tags } from '../../../constants/html_elements';
import { argsStringify } from '../../../utils/json_handlers';
import BaseComponent from '../base/base.component';
import { Button } from '../button/button.component';
import { ParamsInput } from '../params/params_input.component';
import './req-json.scss';

export default class ReqJson extends BaseComponent {
  arguments: { [key:string] : string } = {};

  constructor(action:string, subscribe: (component: ParamsInput) => void) {
    super(Tags.DIV, ['json-request']);
    const { role } = STORE.getState();
    if (role) this.arguments.role = role;
    this.arguments.action = action;
    this.append(...this.render(action, subscribe));
  }

  render = (
    action:string, subscribe: (component: ParamsInput) => void
  ):[BaseComponent, BaseComponent] => {
    const button = new Button({
      name: 'Copy',
      action
    });
    const input = this.inputDecorator(ParamsInput, subscribe);
    button.addEventListener('click', () => {
      const element = <HTMLInputElement>input.element;
      navigator.clipboard.writeText(element.value);
    });
    return [input, button];
  };

  inputDecorator = (
    Component: typeof ParamsInput,
    subscribe: (component: ParamsInput) => void
  ):ParamsInput => {
    const component = new Component('request', subscribe);
    component.valueChanger = this.valueChanger(component);
    component.element.dispatchEvent(new Event('input'));
    component.element.removeEventListener('input', component.listener!);
    return component;
  };

  valueChanger = (component: ParamsInput) => (params: IActionParams):void => {
    const element = <HTMLInputElement>component.element;
    element.value = `"args":"${
      argsStringify({ ...this.arguments, ...params })}"`;
  };
}
