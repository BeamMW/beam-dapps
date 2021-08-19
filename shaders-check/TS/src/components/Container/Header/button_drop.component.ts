import { BeamApiParams } from 'beamApiProps';
import {
  dragleaveHandler, dropHandler, dragoverHandler
} from '../../../utils/dragndrop_handlers';
import { Tags } from '../../../constants/html_elements';
import { buttonDropInnerHtml } from '../../../constants/svgs';
import { InnerTexts } from '../../../constants/variables';
import BaseComponent from '../../BaseComponent/base.component';

export default class ButtonDrop extends BaseComponent {
  constructor(
    initShader: (shader:ArrayBuffer) => void,
    callApi:(callid: string, method: string, params: BeamApiParams) => void
  ) {
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
    span.element.innerText = InnerTexts.DROP_BUTTON_TXT;
    label.append(span);
    wrapper.append(input, label);
    this.append(wrapper);

    label.element.addEventListener('dragover', dragoverHandler);
    label.element.addEventListener('dragleave', dragleaveHandler);
    label.element.addEventListener('drop', (e:DragEvent) => dropHandler({
      e,
      initShader,
      callApi,
      span: span.element
    }));
  }
}
