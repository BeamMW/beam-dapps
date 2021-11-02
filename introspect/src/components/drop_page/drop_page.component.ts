import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import ButtonDrop from '../shared/drop-button/button_drop.component';
import './mainPage.scss';

export default class DropPage extends BaseComponent {
  buttonDrop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['upload', 'active']);
    this.buttonDrop = new ButtonDrop({
      mainSelector: 'formUpload',
      labelSelector: 'label',
      preload: true
    });
    this.append(this.buttonDrop);
  }
}
