import { IFormState } from '@alltypes';
import { InnerTexts, Tags } from '@constants/html-elements';
import { svgData } from '@lib/data';
import { RC, AC } from '@logic/action-creators';
import { STORE, BEAM } from '@logic/controllers';
import {
  dragoverHandler, dragleaveHandler, inputHandler
} from '@utils/dragndrop_handlers';
import { toDOMParser } from '@utils/string-handlers';
import BaseComponent from '../base/base.component';
import Button from '../button/button.component';

export default class DropButton extends BaseComponent {
  setFilename: (text: string) => void;

  fileName:string = STORE.getState().fileName || InnerTexts.DROP_BUTTON_TXT;

  constructor({
    mainSelector,
    labelSelector,
    preload = false
  } : {
    mainSelector: string,
    labelSelector: string,
    preload?: boolean
  }) {
    super(preload
      ? Tags.DIV
      : Tags.LABEL, [mainSelector]);
    STORE.subscribe(this);
    const label = this.createLabel(labelSelector, preload);
    const icon = new BaseComponent(Tags.DIV, ['icon']);
    const text = new BaseComponent(Tags.SPAN, ['text']);

    this.setFilename = this.initTextDom(text);
    this.setFilename(this.fileName);
    if (preload) icon.append(toDOMParser(svgData.iconDrop));

    this.element.addEventListener('dragover', dragoverHandler);
    this.element.addEventListener('dragleave', dragleaveHandler);
    this.element.addEventListener(
      'drop', (e: DragEvent) => inputHandler(e, this.setContract)
    );
    (preload ? label : this).element.addEventListener(
      'change', (e: Event) => inputHandler(e, this.setContract)
    );

    this.append(label, text, icon);
  }

  setContract = (files: ArrayBuffer, fileName: string):void => {
    BEAM.callApi(RC.createForm(files));
    STORE.dispatch(AC.setFileName(fileName));
  };

  createInput = ():BaseComponent => {
    const component = new BaseComponent(Tags.INPUT, ['input']);
    component.setAttributes({
      accept: '.wasm',
      readonly: '',
      type: 'file'
    });
    component.style.display = 'none';
    return component;
  };

  informForm = (state: IFormState):void => {
    if (state.fileName !== this.fileName) {
      this.fileName = state.fileName;
      this.setFilename(state.fileName);
    }
  };

  beforeLoad = (iconArrow:string):Button => {
    const component = new Button({
      tag: Tags.LABEL,
      name: 'load a file',
      action: 'beforeload',
      icon: iconArrow
    });
    component.append(this.createInput());
    return component;
  };

  afterLoad = (labelSelector: string, iconSvg:string):BaseComponent => {
    const component = new BaseComponent(Tags.DIV, [labelSelector]);
    const icon = new BaseComponent(Tags.DIV, ['iconArr']);
    icon.append(toDOMParser(iconSvg));
    component.append(icon, this.createInput());
    return component;
  };

  createLabel = (
    labelSelector: string, preload:boolean
  ):BaseComponent | Button => (preload
    ? this.beforeLoad(svgData.iconArrow)
    : this.afterLoad(labelSelector, svgData.iconFile));
}
