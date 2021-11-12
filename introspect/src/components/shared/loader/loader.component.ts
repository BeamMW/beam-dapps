import loader from '@assets/loader.svg';
import ok from '@assets/ok.svg';
import fail from '@assets/fail.svg';
import { Tags } from '@constants/html-elements';
import BaseComponent from '../base/base.component';
import './loader.scss';

class Loader extends BaseComponent {
  private setImage: (src: string) => void;

  constructor() {
    super(Tags.DIV, ['loader']);
    const img = new BaseComponent(Tags.IMG);
    img.setAttributes({
      src: loader,
      alt: 'loader'
    });
    this.setImage = this.initImageDom(img);
    this.append(img);
  }

  public readonly setOK = (isComplete: boolean):void => {
    this.setImage(isComplete ? ok : fail);
  };
}

export default Loader;
