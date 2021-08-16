import { buttonDropInnerHtml } from '../../../constants/svgs';
import BaseComponent from '../../BaseComponent/BaseComponent';

export default class ButtonDrop extends BaseComponent {
  constructor() {
    super('form', ['form']);
    const wrapper = new BaseComponent('div', ['chooseWasm__wrapper']);
    const input = new BaseComponent('input', ['chooseWasm__input']);
    input.setAttributes({
      id: 'chooseWasm',
      type: 'file',
      accept: '.wasm'
    });
    const label = new BaseComponent('label', ['chooseWasm__label']);
    label.setAttributes({ for: 'chooseWasm' });
    label.element.innerHTML = buttonDropInnerHtml;
    wrapper.append(input, label);
    this.append(wrapper);
  }
}
