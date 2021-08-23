import { APIResponse, BeamApiHandlers, IRoleOutput } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';

type HTMLAttributes = {
  [key:string]: string;
};

type InformArgs = {
  currentRole: string,
  currentAction: string,
  roleOutput: IRoleOutput
};

export interface IObserverComponent extends BaseComponent {
  inform: (state: BeamApiHandlers, object: APIResponse) => void;
}

export interface IObserverFormComponent extends BaseComponent {
  inform: (state: InformArgs) => void;
}

export default class BaseComponent {
  readonly element: HTMLElement;

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
