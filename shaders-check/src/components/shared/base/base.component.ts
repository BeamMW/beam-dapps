import { APIResponse } from 'beamApiProps';
import { IFormState } from 'formProps';
import { Tags } from '../../../constants/html_elements';

type HTMLAttributes = {
  [key:string]: string;
};

export default class BaseComponent {
  readonly element: HTMLElement;

  public inform?: (res:APIResponse) => void;

  public informForm?: (obj: IFormState) => void;

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

  protected initTextDom = (node: BaseComponent): (text: string) => void => {
    const component = node;
    return (text: string) => {
      component.textContent = text;
    };
  };

  protected initImageDom = (node: BaseComponent): (src:string) => void => {
    const component = node;
    return (src: string) => {
      component.setAttributes({
        src
      });
    };
  };

  insertFirst = (component:BaseComponent | HTMLElement):void => {
    const { firstChild } = this.element;
    if (component instanceof BaseComponent) {
      this.element.insertBefore(component.element, firstChild);
    } else this.element.insertBefore(component, firstChild);
  };

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

  replace = (component:BaseComponent | HTMLElement):void => {
    this.element.replaceWith(
      component instanceof BaseComponent
        ? component.element
        : component
    );
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

  querySelector = (
    selector: string
  ):HTMLElement | null => this.element.querySelector(selector);
}
