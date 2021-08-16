import BaseComponent from '../BaseComponent/BaseComponent';
import ButtonDrop from './Header/ButtonDrop';

export default class Container extends BaseComponent {
  constructor() {
    super('div', ['container']);
    const header = new BaseComponent('div', ['header-container']);
    header.append(new ButtonDrop());
    this.append(header);
  }
}
