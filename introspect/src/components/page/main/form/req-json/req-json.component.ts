import { IActionParams } from '@alltypes';
import { BaseComponent, Input, Button } from '@components/shared';
import { Tags } from '@constants/html-elements';
import { STORE } from '@logic/controllers';
import { argsStringify } from '@utils/string-handlers';
import './req-json.scss';

export default class ReqJson extends BaseComponent {
  arguments: { [key: string]: string } = {};

  constructor(action: string, subscribe: (component: Input) => void) {
    super(Tags.DIV, ['json-request']);
    const { role } = STORE.getState();
    if (role) this.arguments.role = role;
    this.arguments.action = action;
    this.append(...this.render(action, subscribe));
  }

  render = (
    action: string,
    subscribe: (component: Input) => void
  ): [BaseComponent, BaseComponent] => {
    const button = new Button({
      name: 'Copy',
      action
    });
    const input = this.inputDecorator(Input, subscribe);
    button.addEventListener('click', () => {
      const element = <HTMLInputElement>input.element;
      element.focus();
      element.select();
      navigator.clipboard
        .writeText(element.value)
        .catch(() => this.copy(element));
    });
    return [input, button];
  };

  copy = (node: HTMLInputElement): void => {
    const aux = document.createElement('div');
    aux.setAttribute('contentEditable', 'true');
    aux.innerHTML = node.value;
    aux.setAttribute('onfocus', "document.execCommand('selectAll',false,null)");
    document.body.appendChild(aux);
    aux.focus();
    document.execCommand('copy');
    document.body.removeChild(aux);
  };

  inputDecorator = (
    Component: typeof Input,
    subscribe: (component: Input) => void
  ): Input => {
    const component = new Component('request');
    component.valueChanger = this.valueChanger(component);
    subscribe(component);
    component.element.removeEventListener('input', component.listener!);
    component.element.dispatchEvent(new Event('input'));
    return component;
  };

  valueChanger =
  (component: Input) => (params: IActionParams): void => {
    const responseObj = {
      jsonrpc: '2.0',
      id: this.arguments.action,
      method: 'invoke_contract',
      params: {
        contract_file: '/your contract/',
        args: argsStringify({ ...this.arguments, ...params })
      }
    };

    const element = <HTMLInputElement>component.element;
    element.value = JSON.stringify(responseObj);
  };
}
