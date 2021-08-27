import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './button.scss';

export default class Button extends BaseComponent {
  constructor() {
    super(Tags.INPUT, ['button']);
    this.setAttributes({
      type: 'button'
      //  value: 'New Game'
    });
  }
}
