import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';
import { BEAM } from '../../controllers/beam.controller';
import BaseComponent from '../shared/base/base.component';
import fileImage from '../../assets/icon/file.svg';
import './header.scss';
import HeaderDrop from './headerDrop.component';
import InfoBlock from './infoblock.component';

export default class Header extends BaseComponent {
  headerDrop: HeaderDrop;

  constructor() {
    super(Tags.DIV, ['header']);
    BEAM.addObservers(this);
    this.headerDrop = new HeaderDrop();
    const img = new BaseComponent(Tags.IMG, ['header__img']);

    img.setAttributes({
      src: fileImage
    });

    this.append(this.headerDrop, new InfoBlock());
  }

  inform = (res: APIResponse): void => {
    if (res.error) {
      console.log(res.error.code);
    }
  };
}
