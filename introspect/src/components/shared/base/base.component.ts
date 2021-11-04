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

  private _listener: ((e: Event) => void) | null = null;

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

  public set listener(callback: ((e: Event) => void) | null) {
    this._listener = callback;
  }

  public get listener(): (((e: Event) => void) | null) {
    return this._listener;
  }

  public set innerHTML(str : string) {
    this.element.innerHTML = str;
  }

  protected initTextDom = (
    node: BaseComponent
  ): (text: string
    ) => BaseComponent => {
    const component = node;
    return (text: string) => {
      component.textContent = text;
      return this;
    };
  };

  protected initImageDom = (
    node: BaseComponent
  ): (src:string
    ) => BaseComponent => {
    const component = node;
    return (src: string) => {
      component.setAttributes({
        src
      });
      return this;
    };
  };

  insertFirst = (component:BaseComponent | HTMLElement):BaseComponent => {
    const { firstChild } = this.element;
    if (component instanceof BaseComponent) {
      this.element.insertBefore(component.element, firstChild);
    } else this.element.insertBefore(component, firstChild);
    return this;
  };

  append = (...args: (BaseComponent | HTMLElement)[]):BaseComponent => {
    const nodes = args.map(
      (component) => {
        if (component instanceof BaseComponent) return component.element;
        return component;
      }
    );
    this.element.append(...nodes);
    return this;
  };

  remove = (...args: BaseComponent[]):BaseComponent => {
    args.forEach(
      (component) => this.element.removeChild(component.element)
    );
    return this;
  };

  replace = (component:BaseComponent | HTMLElement):BaseComponent => {
    this.element.replaceWith(
      component instanceof BaseComponent
        ? component.element
        : component
    );
    return this;
  };

  removeAll = ():BaseComponent => {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    return this;
  };

  setAttributes = (obj:HTMLAttributes):BaseComponent => {
    const attr = Object.entries(obj);
    attr.forEach((attribute) => {
      this.element.setAttribute(attribute[0], attribute[1]);
    });
    return this;
  };

  querySelector = (
    selector: string
  ):HTMLElement | null => this.element.querySelector(selector);
}
