export default class BaseComponent {
  readonly element: HTMLElement;

  constructor(tag = 'div', styles: string[] = []) {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
  }

  append = (...args: BaseComponent[]):void => {
    const nodes = args.map(
      (component) => component.element
    );
    this.element.append(...nodes);
  };
}
