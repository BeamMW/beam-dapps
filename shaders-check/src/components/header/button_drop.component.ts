import {
  dragleaveHandler, dropHandler, dragoverHandler
} from '../../utils/dragndrop_handlers';
import { InnerTexts, Tags } from '../../constants/html_elements';
import { SVG } from '../../constants/svg.icons';
import BaseComponent from '../shared/base/base.component';

export default class ButtonDrop extends BaseComponent {
  constructor() {
    super(Tags.FORM, ['formUpload']);
    const input = new BaseComponent(Tags.INPUT, ['input']);
    const label = new BaseComponent(Tags.LABEL, ['label']);
    const icon = new BaseComponent(Tags.DIV, ['icon']);
    const iconArr = new BaseComponent(Tags.DIV, ['iconArr']);
    const labelText = new BaseComponent(Tags.DIV, ['labelText']);
    const span = new BaseComponent(Tags.SPAN, ['text']);
    input.setAttributes({
      id: 'chooseWasm',
      type: 'file',
      accept: '.wasm'
    });
    label.setAttributes({ for: 'chooseWasm' });
    iconArr.element.innerHTML = SVG.iconArrow;
    labelText.element.textContent = 'load a file';
    label.append(iconArr, labelText);
    icon.element.innerHTML = SVG.iconDrop;
    span.element.innerText = InnerTexts.DROP_BUTTON_TXT;
    this.append(input, label, span, icon);
    this.element.addEventListener('dragover', dragoverHandler);
    this.element.addEventListener('dragleave', dragleaveHandler);
    this.element.addEventListener(
      'drop', (e:DragEvent) => dropHandler(e, span.element)
    );
  }
}
