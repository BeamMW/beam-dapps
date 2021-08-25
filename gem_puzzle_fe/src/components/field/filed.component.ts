import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';

// const blockArr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] // 4x4

import './field.scss';

export default class Field extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['field']);
    for (let i = 0; i < 16; i++) {
      let block = new BaseComponent(Tags.DIV, ['block', `block-${i}`]);
      block.element.innerHTML = `${i}`;
      this.append(block);
    }
  }
}
