import { SVG } from '../../constants/svg.icons';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import ButtonDrop from '../shared/drop_button/button_drop.component';
import './mainPage.scss';

export default class DropPage extends BaseComponent {
  buttonDrop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['upload', 'active']);
    this.buttonDrop = new ButtonDrop({
      mainSelector: 'formUpload',
      labelSelector: 'label',
      iconPic: SVG.iconDrop,
      iconArrow: SVG.iconArrow
    });
    this.append(this.buttonDrop);
  }
}
