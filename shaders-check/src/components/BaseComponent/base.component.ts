import { APIResponse } from 'beamApiProps';
import { InformArgs } from 'formProps';
import { Tags } from '../../constants/html_elements';
import { BEAM } from '../../utils/api_handlers';

type HTMLAttributes = {
  [key:string]: string;
};

export default class BaseComponent {
  readonly element: HTMLElement;

  inform?: (res:APIResponse) => void;

  informForm?: (obj: InformArgs) => void;

  constructor(tag:Tags, styles: string[] = []) {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
  }

  append = (...args: BaseComponent[]):void => {
    const nodes = args.map(
      (component) => component.element
    );
    this.element.append(...nodes);
  };

  removeAll = ():void => {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  };

  setAttributes = (obj:HTMLAttributes):void => {
    const attr = Object.entries(obj);
    attr.forEach((attribute) => {
      this.element.setAttribute(attribute[0], attribute[1]);
    });
  };

  unsubscribeBeforeRemove = ():void => {
    this.element.addEventListener(
      'DOMNodeRemovedFromDocument',
      () => BEAM.deleteObserver(this.element)
    );
  };
}
