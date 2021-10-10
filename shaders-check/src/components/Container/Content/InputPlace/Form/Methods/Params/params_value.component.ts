import { IActionParams } from 'beamApiProps';
import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../shared/base/base.component';
import { ParamsLabel } from './params_label.component';

export class Params extends BaseComponent {
  constructor(
    params:IActionParams
  ) {
    super(Tags.DIV, ['input__params']);
    this.render(params);
  }

  informForm = (role:string):void => {
    console.log(role);
  };

  render = (
    params:IActionParams
  ):void => {
    this.element.innerHTML = '';
    const title = new BaseComponent(Tags.DIV, ['params-title']);
    title.element.innerText = 'Params: ';
    const list = Object.entries(
      params as IActionParams
    );
    const valuesList = list.map(
      (el) => new ParamsLabel(el[0])
    );
    if (valuesList.length) this.append(title, ...valuesList);
  };
}
