import { IAppState } from 'AppStateProps';
import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';

type HTMLAttributes = {
  [key:string]: string;
};

export default class BaseComponent {
  readonly element: HTMLElement;

  inform?: (res:APIResponse) => void;

  appInform?:(state: IAppState) => void;

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
}
