import { BeamApiHandlers } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';

type HTMLAttributes = {
  [key:string]: string;
};

export default class BaseComponent {
  readonly element: HTMLElement;

  static apiHandler: BeamApiHandlers;

  static state: any;

  inform: (json:string) => void;

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

  setAttributes = (obj:HTMLAttributes):void => {
    const attr = Object.entries(obj);
    attr.forEach((attribute) => {
      this.element.setAttribute(attribute[0], attribute[1]);
    });
  };
}
