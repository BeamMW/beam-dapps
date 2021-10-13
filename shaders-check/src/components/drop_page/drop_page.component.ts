import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import ButtonDrop from '../header/button_drop.component';
import './mainPage.scss';

export default class MainPage extends BaseComponent {
  buttonDrop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['upload', 'active']);
    this.buttonDrop = new ButtonDrop();
    this.append(this.buttonDrop);
  }
}
