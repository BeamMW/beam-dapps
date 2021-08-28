import { APIResponse } from 'beamApiProps';
import { Tags } from '../../../../constants/html_elements';
import { ReqID } from '../../../../constants/variables';
import { ApiHandler } from '../../../../utils/api_handlers';
import BaseComponent from '../../../BaseComponent/base.component';

export class OutputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['output__place']);
    ApiHandler.addObservers(this);
  }

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.SUBMIT_RESULT:
        this.removeAll();
        console.log(res);
        break;
      default:
        break;
    }
  };
}
