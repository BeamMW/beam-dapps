import { IActionParams } from 'beamApiProps';
import { ParamPayloadArgsType } from 'formProps';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';
import { ParamsLabel } from './params_label.component';

export class Params extends BaseComponent {
  constructor(
    params:IActionParams,
    callback: (obj:ParamPayloadArgsType) => void
  ) {
    super(Tags.DIV, ['input__params']);
    this.render(params, callback);
  }

  render = (
    params:IActionParams,
    callback: (obj:ParamPayloadArgsType) => void
  ):void => {
    this.element.innerHTML = '';
    // const title = new BaseComponent(Tags.DIV, ['params-title']);
    const list = Object.entries(
      params as IActionParams
    );
    const valuesList = list.map(
      (el) => new ParamsLabel(el[0], callback)
    );
    if (valuesList.length) this.append(...valuesList);
  };
}
