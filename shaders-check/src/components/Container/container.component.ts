import { Tags } from '../../constants/html_elements';
import BaseComponent from '../BaseComponent/base.component';
import Content from './Content/content.component';
import Header from './Header/header.component';

export default class Container extends BaseComponent {
  private readonly content: BaseComponent;

  header: Header;

  constructor() {
    super(Tags.DIV, ['main']);
    this.header = new Header();
    this.content = new Content();
    this.append(this.header, this.content);
  }
}
