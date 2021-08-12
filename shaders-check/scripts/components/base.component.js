export class BaseComponent {
  constructor(tag = 'div', styles) {
    this.element = document.createElement(tag);
    this.element.classList.add(...styles);
  }
  append = (...args) => {
    const elements = args.map(el => el.element)
    this.element.append(...elements);
  }
}