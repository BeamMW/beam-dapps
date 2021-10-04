import { Tags } from '../../constants/html_elements';
import BaseComponent from '../BaseComponent/base.component';
import Content from './Content/content.component';

export default class Container extends BaseComponent {
  private readonly content: BaseComponent;

  constructor() {
    super(Tags.DIV, ['main']);
    const header = new BaseComponent(
      Tags.DIV, ['header-container', 'container']
    );
    this.content = new Content();
    this.append(header, this.content);
  }
}
