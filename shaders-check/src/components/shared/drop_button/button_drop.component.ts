import {
  dragleaveHandler, dragoverHandler, inputHandler
} from '../../../utils/dragndrop_handlers';
import { InnerTexts, Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';

export default class ButtonDrop extends BaseComponent {
  constructor({
    mainSelector,
    labelSelector,
    iconPic,
    iconArrow
  } : {
    mainSelector: string,
    labelSelector: string,
    iconPic?: string,
    iconArrow?:string }) {
    super(Tags.LABEL, [mainSelector]);
    const input = new BaseComponent(Tags.INPUT, ['input']);
    const label = new BaseComponent(Tags.DIV, [labelSelector]);
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
    label.setAttributes({ for: 'chooseWasm' });
    iconArr.innerHTML = iconArrow || '';
    icon.innerHTML = iconPic || '';
    labelText.textContent = iconPic ? 'load a file' : '';
    span.textContent = InnerTexts.DROP_BUTTON_TXT;

    label.append(input);
    label.append(iconArr, labelText);
    this.append(label, span, icon);

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
