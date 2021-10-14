import {
  dragleaveHandler, dragoverHandler, inputHandler
} from '../../utils/dragndrop_handlers';
import { InnerTexts, Tags } from '../../constants/html_elements';
import { SVG } from '../../constants/svg.icons';
import BaseComponent from '../shared/base/base.component';

export default class HeaderDrop extends BaseComponent {
  constructor() {
    super(Tags.LABEL, ['header__app']);
    const input = new BaseComponent(Tags.INPUT, ['input']);
    const label = new BaseComponent(Tags.DIV, ['header__app-label']);
    const icon = new BaseComponent(Tags.DIV, ['icon']);
    const iconArr = new BaseComponent(Tags.DIV, ['iconArr']);
    const labelText = new BaseComponent(Tags.DIV, ['labelText']);
    const span = new BaseComponent(Tags.SPAN, ['text']);
    input.setAttributes({
      id: 'chooseWasm',
      type: 'file',
      accept: '.wasm',
      readonly: ''
    });
    label.append(input);
    label.setAttributes({ for: 'chooseWasm' });
    iconArr.element.innerHTML = SVG.iconFile;
    labelText.element.textContent = 'load a file';
    label.append(iconArr);
    icon.element.innerHTML = SVG.iconDrop;
    span.element.innerText = InnerTexts.DROP_BUTTON_TXT;
    this.append(label, span);
    this.element.addEventListener('dragover', dragoverHandler);
    this.element.addEventListener('dragleave', dragleaveHandler);
    this.element.addEventListener(
      'drop', (e:DragEvent) => inputHandler(e, span.element)
    );
    this.element.addEventListener(
      'change', (e:Event) => inputHandler(e, span.element)
    );
  }
}
