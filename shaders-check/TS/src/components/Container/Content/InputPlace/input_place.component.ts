import { APIResponse, BeamApiHandlers } from 'beamApiProps';
import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
  }

  inform = (handlers:BeamApiHandlers, json:APIResponse):void => {
    console.log(json);
    console.log(handlers);
  };
}
