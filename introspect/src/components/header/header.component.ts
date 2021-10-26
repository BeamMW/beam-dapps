import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import fileImage from '../../assets/icon/file.svg';
import './header.scss';
import InfoBlock from './infoblock.component';
import ButtonDrop from '../shared/drop_button/button_drop.component';

export default class Header extends BaseComponent {
  headerDrop: ButtonDrop;

  constructor() {
    super(Tags.DIV, ['header']);
    this.headerDrop = new ButtonDrop({
      mainSelector: 'header__app',
      labelSelector: 'header__app-label'
    });
    const img = new BaseComponent(Tags.IMG, ['header__img']);

    img.setAttributes({
      src: fileImage
    });

    this.append(this.headerDrop, new InfoBlock());
  }
}
