import { APIResponse } from 'beamApiProps';
import { InnerTexts, Tags } from '../../../../constants/html_elements';
import { isJson } from '../../../../utils/json_handlers';
import {
  ReqID,
  ResTXStatus,
  ShaderProps
} from '../../../../constants/variables';
import BaseComponent from '../../../shared/base/base.component';
import { TreeBuilder } from './TreeBuilder/tree_builder.component';
import { RC } from '../../../../logic/beam/request_creators';
import { BEAM } from '../../../controllers/beam.controller';
import './output_place.scss';

export class OutputPlace extends BaseComponent {
  action: string;

  constructor(action: string) {
    super(Tags.DIV, ['output__place']);
    BEAM.addObservers(this);
    this.action = action;
    const baseBlock = new BaseComponent(Tags.DIV, ['output__base-block']);
    baseBlock.innerHTML = 'Fill in the parametres to check the method';
    this.append(baseBlock);
  }

  inform = (res: APIResponse): void => {
    switch (res.id) {
      case this.action:
        this.removeAll();
        if (isJson(res.result.output)) {
          this.append(new TreeBuilder(JSON.parse(res.result.output)));
        } else {
          this.element.innerText = `${InnerTexts.NOT_JSON}
        ${res.result.output}`;
        }
        if (res.result.raw_data) {
          BEAM.callApi(RC.invokeData(ReqID.INVOKE_DATA, res.result.raw_data));
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
