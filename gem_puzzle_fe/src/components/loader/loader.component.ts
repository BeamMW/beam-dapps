import loader from '../../assets/icon/loader.svg';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import './loader.scss';

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
