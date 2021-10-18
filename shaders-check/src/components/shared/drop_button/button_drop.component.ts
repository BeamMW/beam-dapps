import { IFormState } from 'formProps';
import { AC } from '../../../logic/store/action_creators';
import { STORE } from '../../../controllers/store.controller';
import {
  dragleaveHandler, dragoverHandler, inputHandler
} from '../../../utils/dragndrop_handlers';
import { InnerTexts, Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';
import { BEAM } from '../../../controllers/beam.controller';
import { RC } from '../../../logic/beam/request_creators';

export default class ButtonDrop extends BaseComponent {
  setFilename: (text: string) => void;

  fileName:string = STORE.getState().fileName || InnerTexts.DROP_BUTTON_TXT;

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
    STORE.addObserver(this);
    const input = new BaseComponent(Tags.INPUT, ['input']);
    const label = new BaseComponent(Tags.DIV, [labelSelector]);
    const icon = new BaseComponent(Tags.DIV, ['icon']);
    const iconArr = new BaseComponent(Tags.DIV, ['iconArr']);
    const labelText = new BaseComponent(Tags.DIV, ['labelText']);
    const text = new BaseComponent(Tags.SPAN, ['text']);
    this.setFilename = this.initDom(text);

    input.setAttributes({
      id: 'chooseWasm',
      type: 'file',
      accept: '.wasm',
      readonly: ''
    });

    this.setFilename(this.fileName);
    label.setAttributes({ for: 'chooseWasm' });
    iconArr.innerHTML = iconArrow || '';
    icon.innerHTML = iconPic || '';
    labelText.textContent = iconPic ? 'load a file' : '';

    label.append(input, iconArr, labelText);
    this.append(label, text, icon);

    this.element.addEventListener('dragover', dragoverHandler);
    this.element.addEventListener('dragleave', dragleaveHandler);
    this.element.addEventListener(
      'drop', (e: DragEvent) => inputHandler(e, this.setContract)
    );
    this.element.addEventListener(
      'change', (e: Event) => inputHandler(e, this.setContract)
    );
  }

  setContract = (files: ArrayBuffer, fileName: string):void => {
    BEAM.callApi(RC.createForm(files));
    STORE.dispatch(AC.setFileName(fileName));
  };

  informForm = (state: IFormState):void => {
    if (state.fileName !== this.fileName) {
      this.fileName = state.fileName;
      this.setFilename(state.fileName);
    }
  };
}
