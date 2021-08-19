import { Params } from '../../../beamAPI/BeamAPI';
import { Tags } from '../../../constants/html_elements';
import { buttonDropInnerHtml } from '../../../constants/svgs';
import { InnerTexts, ShaderProps } from '../../../constants/variables';
import BaseComponent from '../../BaseComponent/base.component';

export default class ButtonDrop extends BaseComponent {
  constructor(
    initShader: (shader:ArrayBuffer) => void,
    callApi:(callid: string, method: string, params: Params) => void
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

    label.element.ondragover = () => {
      label.element.classList.add('hover');
      return false;
    };

    label.element.ondragleave = () => {
      label.element.classList.remove('hover');
      return false;
    };
    label.element.addEventListener('drop', async (e):Promise<void | false> => {
      e.preventDefault();
      label.element.classList.remove('hover');
      label.element.classList.add('drop');
      const uploadDragFiles = e.dataTransfer?.files as FileList;
      const files = await uploadDragFiles[0]?.arrayBuffer() as ArrayBuffer;
      initShader(files);
      callApi('form-generator', 'invoke_contract', {
        create_tx: false
      });
      if (uploadDragFiles[0]
        && uploadDragFiles[0].size > ShaderProps.MAX_FILE_SIZE) {
        span.element.textContent = InnerTexts.DROP_SIZE_ERROR_TXT;
        label.element.classList.add('error');
        return false;
      } span.element.textContent = uploadDragFiles[0]?.name as string;
      return undefined;
    });
  }
}
