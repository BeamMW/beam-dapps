import { APIResponse } from 'beamApiProps';
import { InnerTexts, Tags } from '../../../../constants/html_elements';
import { isJson } from '../../../../utils/json_handlers';
import { ReqID, ResTXStatus } from '../../../../constants/variables';
import BaseComponent from '../../../BaseComponent/base.component';
import { TreeBuilder } from './TreeBuilder/tree_builder.component';
import { invokeData, txStatus } from '../../../../utils/request_creators';

export class OutputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['output__place']);
  }

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.SUBMIT_RESULT:
        if (res.result.raw_data) {
          invokeData(ReqID.INVOKE_DATA, res.result.raw_data);
        } else {
          this.removeAll();
          if (isJson(res.result.output)) {
            this.append(new TreeBuilder(JSON.parse(res.result.output)));
          } else {
            this.element.innerText = `${InnerTexts.NOT_JSON}
          ${res.result.output}`;
          }
        }
        break;
      case ReqID.INVOKE_DATA:
        txStatus(res.result.txid);
        break;
      case ReqID.TX_STATUS:
        if (res.result.status_string === ResTXStatus.IN_PROGRESS) {
          txStatus(res.result.txId);
        } else {
          console.log(res);
        }
        break;
      default:
        break;
    }
  };
}
