import loader from '../../../assets/icon/loader.svg';
import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import './loader.scss';

export default class Loader extends BaseComponent {
  constructor(selector = 'something') {
    super(Tags.DIV, ['loader', selector]);
    const img = new BaseComponent(Tags.IMG);
    img.setAttributes({
      src: loader,
      alt: 'loader'
    });
    this.append(img);
  }
}
