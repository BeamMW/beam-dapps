import { APIResponse, BeamApiHandlers } from 'beamApiProps';
import { ReqIds } from '../../../../constants/variables';
import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
  }

  inform = (_handlers:BeamApiHandlers, json:APIResponse):void => {
    if (json.id === ReqIds.FORM_GENERATOR) {
      console.log(':3');
    }
  };
}
