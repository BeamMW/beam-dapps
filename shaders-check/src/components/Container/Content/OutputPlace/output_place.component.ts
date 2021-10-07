import { APIResponse } from 'beamApiProps';
import { InnerTexts, Tags } from '../../../../constants/html_elements';
import { isJson } from '../../../../utils/json_handlers';
import {
  ReqID,
  ResTXStatus,
  ShaderProps
} from '../../../../constants/variables';
import BaseComponent from '../../../BaseComponent/base.component';
import { TreeBuilder } from './TreeBuilder/tree_builder.component';
import { RC } from '../../../../utils/request_creators';
import { BEAM } from '../../../../utils/api_handlers';

export class OutputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['output__place']);
    this.unsubscribeBeforeRemove();
  }

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case ReqID.SUBMIT_RESULT:
        if (res.result.raw_data) {
          BEAM.callApi(RC.invokeData(ReqID.INVOKE_DATA, res.result.raw_data));
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
        BEAM.callApi(RC.txStatus(res.result.txid));
        break;
      case ReqID.TX_STATUS:
        if (res.result.status_string === ResTXStatus.IN_PROGRESS) {
          setTimeout(() => {
            BEAM.callApi(RC.txStatus(res.result.txId));
          }, ShaderProps.TX_CHECK_INTERVAL);
        } else {
          console.log(res);
        }
        break;
      default:
        break;
    }
  };
}
