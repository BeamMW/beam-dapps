import BaseComponent from '../base/base.component';
import loader from '../../../assets/loader.svg';
import { Tags } from '../../../constants/html_elements';

export default class Loader extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['loader']);
    const img = new BaseComponent(Tags.IMG);
    img.setAttributes({
      src: loader,
      alt: 'loader'
    });
    this.append(img);
  }
}
