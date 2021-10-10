import { APIResponse } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';

type HTMLAttributes = {
  [key:string]: string;
};

export default class BaseComponent {
  readonly element: HTMLElement;

  inform?: (res:APIResponse) => void;

  informForm?: (obj: string) => void;

  constructor(tag:Tags, styles: string[] = []) {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
  }

  public get classList():DOMTokenList { return this.element.classList; }

  public get style():CSSStyleDeclaration { return this.element.style; }

  public get dataset():DOMStringMap { return this.element.dataset; }

  public set textContent(str : string) {
    this.element.textContent = str;
  }

  public set innerHTML(str : string) {
    this.element.innerHTML = str;
  }

  append = (...args: (BaseComponent | HTMLElement)[]):void => {
    const nodes = args.map(
      (component) => {
        if (component instanceof BaseComponent) return component.element;
        return component;
      }
    );
    this.element.append(...nodes);
  };

  remove = (...args: BaseComponent[]):void => {
    args.forEach(
      (component) => this.element.removeChild(component.element)
    );
  };

  replace = (component:BaseComponent):void => {
    this.element.replaceWith(component.element);
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
}
