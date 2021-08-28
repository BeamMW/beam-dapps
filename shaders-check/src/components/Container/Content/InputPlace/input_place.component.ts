import { APIResponse } from 'beamApiProps';
import { ReqID } from '../../../../constants/variables';
import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';
import { Form } from './Form/form.component';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
  }

  inform = (json:APIResponse):void => {
    switch (json.id) {
      case ReqID.FORM_GENERATOR:
        this.removeAll();
        this.append(new Form(JSON.parse(json.result.output)));
        break;
      default:
        break;
    }
  };
}
