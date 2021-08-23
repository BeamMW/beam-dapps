import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../BaseComponent/base.component';

export class ParamsInput extends BaseComponent {
  constructor(param: [string, unknown]) {
    super(Tags.INPUT, ['params__input']);
    this.setAttributes({ placeholder: param[0] });
  }
}
