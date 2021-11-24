import { IState } from 'AppStateProps';
import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html';

type HTMLAttributes = {
  [key:string]: string;
};

export default class BaseComponent {
  readonly element: HTMLElement;

  inform?: (res:APIResponse) => void;

  appInform?:(state: IState) => void;

  constructor(tag:Tags, styles: string[] = []) {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
  }

  public get classList():DOMTokenList { return this.element.classList; }

  public set innerHTML(inner: string) { this.element.innerHTML = inner; }

  public set checked(bool: boolean) {
    (this.element as HTMLInputElement).checked = bool;
  }

  public get style():CSSStyleDeclaration { return this.element.style; }

  public get dataset():DOMStringMap { return this.element.dataset; }

  append = (...args: (BaseComponent | HTMLElement)[]):this => {
    const nodes = args.map(
      (component) => {
        if (component instanceof BaseComponent) return component.element;
        return component;
      }
    );
    this.element.append(...nodes);
    return this;
  };

  removeAll = ():this => {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    return this;
  };

  remove = (...args: BaseComponent[]):this => {
    args.forEach(
      (component) => this.element.removeChild(component.element)
    );
    return this;
  };

  replace = (component:BaseComponent):this => {
    this.element.replaceWith(component.element);
    return this;
  };

  setAttributes = (obj:HTMLAttributes):this => {
    const attr = Object.entries(obj);
    attr.forEach((attribute) => {
      this.element.setAttribute(attribute[0], attribute[1]);
    });
    return this;
  };
}
