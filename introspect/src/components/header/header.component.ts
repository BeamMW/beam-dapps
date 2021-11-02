import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import './header.scss';
import InfoBlock from './infoblock.component';
import ButtonDrop from '../shared/drop-button/button_drop.component';

export default class Header extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['header']);
    const headerDrop = new ButtonDrop({
      mainSelector: 'header__app',
      labelSelector: 'header__app-label'
    });
    this.append(headerDrop, new InfoBlock());
  }
}
