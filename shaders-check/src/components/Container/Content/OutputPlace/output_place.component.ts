import { APIResponse } from 'beamApiProps';
import { InnerTexts, Tags } from '../../../../constants/html_elements';
import { isJson } from '../../../../utils/json_handlers';
import { ReqID } from '../../../../constants/variables';
import { ApiHandler } from '../../../../utils/api_handlers';
import BaseComponent from '../../../BaseComponent/base.component';
import { TreeBuilder } from './TreeBuilder/tree_builder.component';

export class OutputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['output__place']);
    ApiHandler.addObservers(this);
  }

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.SUBMIT_RESULT:
        console.log(res);
        this.removeAll();
        if (isJson(res.result.output)) {
          this.append(new TreeBuilder(JSON.parse(res.result.output)));
        } else {
          this.element.innerText = `${InnerTexts.NOT_JSON}
          ${res.result.output}`;
        }
        break;
      default:
        break;
    }
  };
}
