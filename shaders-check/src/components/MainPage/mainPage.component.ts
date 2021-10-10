import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import ButtonDrop from '../Container/Header/button_drop.component';
// import Content from '../Container/Content/content.component';
import './mainPage.scss';

export default class MainPage extends BaseComponent {
  buttonDrop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['upload', 'active']);
    // const container = new BaseComponent(Tags.DIV, ['wrapper']);
    this.buttonDrop = new ButtonDrop();
    // container.append(this.buttonDrop);
    // this.content = new Content();
    this.append(this.buttonDrop);
  }
}
