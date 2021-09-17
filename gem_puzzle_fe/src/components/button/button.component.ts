import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './button.scss';

export default class Button extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['button']);
    this.setAttributes({
      type: 'button'
    });
  }

  public set setDisplay(value : boolean) {
    this.style.display = value ? 'flex' : 'none';
  }
}
