import { IActionParams } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';
import { ParamsInput } from './params_input.component';
import { ParamsLabel } from './params_label.component';
import './params.scss';

export class Params extends BaseComponent {
  constructor(
    params:IActionParams,
    subscribe: (component: ParamsInput) => void
  ) {
    super(Tags.DIV, ['input__params']);
    this.render(params, subscribe);
  }

  render = (
    params:IActionParams,
    subscribe: (component: ParamsInput) => void
  ):void => {
    this.removeAll();
    const list = Object.entries(
      params as IActionParams
    );
    const valuesList = list.map(
      (el) => new ParamsLabel(el, subscribe)
    );
    if (valuesList.length) this.append(...valuesList);
  };
}
