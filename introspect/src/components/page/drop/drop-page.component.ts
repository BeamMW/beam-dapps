import { BaseComponent, DropButton } from '@components/shared';
import { Tags } from '@constants/html-elements';
import './drop-page.scss';

export default class DropPage extends BaseComponent {
  buttonDrop: BaseComponent;

  constructor() {
    super(Tags.DIV, ['file-upload', 'active']);
    this.buttonDrop = new DropButton({
      mainSelector: 'formUpload',
      labelSelector: 'label',
      preload: true
    });
    this.append(this.buttonDrop);
  }
}
