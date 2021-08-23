import { APIResponse, BeamApiHandlers } from 'beamApiProps';
import { ReqIds } from '../../../../constants/variables';
import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';
import { Form } from './Form/form.component';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
  }

  inform = (_handlers:BeamApiHandlers, json:APIResponse):void => {
    if (json.id === ReqIds.FORM_GENERATOR) {
      const { output } = json.result;
      // console.log(JSON.parse(output.slice(0, -1)));
      this.append(new Form(JSON.parse(output)));
    }
  };
}
