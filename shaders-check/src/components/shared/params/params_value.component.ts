import { IActionParams } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';
import { ParamsInput } from './params_input.component';
import { ParamsLabel } from './params_label.component';

export class Params extends BaseComponent {
  constructor(
    params:IActionParams,
    addObserver: (component: ParamsInput) => void
  ) {
    super(Tags.DIV, ['input__params']);
    this.render(params, addObserver);
  }

  render = (
    params:IActionParams,
    addObserver: (component: ParamsInput) => void
  ):void => {
    this.element.innerHTML = '';
    const list = Object.entries(
      params as IActionParams
    );
    const valuesList = list.map(
      (el) => new ParamsLabel(el[0], addObserver)
    );
    if (valuesList.length) this.append(...valuesList);
  };
}
