import { BeamAPI } from '../../beamAPI/beamAPI';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../BaseComponent/base.component';
import Content from './Content/content.component';
import ButtonDrop from './Header/button_drop.component';

export default class Container extends BaseComponent {
  private readonly content: BaseComponent;

  constructor({ addObservers }:BeamAPI) {
    super(Tags.DIV);
    const header = new BaseComponent(
      Tags.DIV, ['header-container', 'container']
    );
    header.append(new ButtonDrop());
    this.content = new Content(addObservers);
    this.append(header, this.content);
  }
}