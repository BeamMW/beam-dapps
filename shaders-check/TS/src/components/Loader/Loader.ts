import BaseComponent from '../BaseComponent/BaseComponent';
import loader from '../../assets/loader.svg';

export default class Loader extends BaseComponent {
  constructor() {
    super('div', ['loader']);
    const img = new BaseComponent('img');
    img.setAttributes({
      src: loader,
      alt: 'loader'
    });
    this.append(img);
  }
}
