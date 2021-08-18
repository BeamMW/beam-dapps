import { Tags } from '../../../constants/html_elements';
import { buttonDropInnerHtml } from '../../../constants/svgs';
import { InnerTexts } from '../../../constants/variables';
import BaseComponent from '../../BaseComponent/base.component';

export default class ButtonDrop extends BaseComponent {
  constructor() {
    super(Tags.FORM, ['form']);
    const wrapper = new BaseComponent(Tags.DIV, ['chooseWasm__wrapper']);
    const input = new BaseComponent(Tags.INPUT, ['chooseWasm__input']);
    const label = new BaseComponent(Tags.LABEL, ['chooseWasm__label']);
    const span = new BaseComponent(Tags.SPAN, ['chooseWasm__text']);
    input.setAttributes({
      id: 'chooseWasm',
      type: 'file',
      accept: '.wasm'
    });
    label.setAttributes({ for: 'chooseWasm' });
    label.element.innerHTML = buttonDropInnerHtml;
    span.element.innerText = InnerTexts.DROP_BUTTON_TEXT;
    label.append(span);
    wrapper.append(input, label);
    this.append(wrapper);
  }
}
