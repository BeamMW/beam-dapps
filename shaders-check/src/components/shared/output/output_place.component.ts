import { APIResponse } from 'beamApiProps';
import { IFormState } from 'formProps';
import { InnerTexts, Tags } from '../../../constants/html_elements';
import { isJson } from '../../../utils/json_handlers';
import {
  ReqID,
  ResTXStatus,
  ShaderProps
} from '../../../constants/variables';
import BaseComponent from '../base/base.component';
import { TreeBuilder } from '../tree_builder/tree_builder.component';
import { RC } from '../../../logic/beam/request_creators';
import { BEAM } from '../../../controllers/beam.controller';
import './output_place.scss';
import { FORM } from '../../../controllers/form.controller';
import { deleteOnloadAC } from '../../../logic/form/action_creators';
import Loader from '../../Loader/loader.component';

export class OutputPlace extends BaseComponent {
  action: string;

  child: BaseComponent;

  constructor(action: string) {
    super(Tags.DIV, ['output__place']);
    BEAM.addObservers(this);
    FORM.addObserver(this);
    const wrapper = new BaseComponent(Tags.DIV, ['output__container']);
    this.child = new BaseComponent(Tags.DIV, ['output_inner']);

    this.action = action;
    this.child.innerHTML = 'Fill in the parametres to check the method';

    wrapper.append(this.child);
    this.append(wrapper);
  }

  informForm = (state: IFormState): void => {
    if (state.onload.has(this.action)) {
      const loadingBlock = new BaseComponent(Tags.DIV, [
        'output_inner',
        'output_loading-block'
      ]);
      loadingBlock.append(new Loader());
      this.child.replace(loadingBlock);
      this.child = loadingBlock;
    }
  };

  inform = (res: APIResponse): void => {
    const THIS_ACTION = this.action;
    const THIS_INVOKE_DATA = `${ReqID.INVOKE_DATA}_${THIS_ACTION}`;
    const THIS_TX_STATUS = `${ReqID.TX_STATUS}_${THIS_ACTION}`;
    if (!res.error) {
      switch (res.id) {
        case THIS_ACTION:
          FORM.dispatch(deleteOnloadAC(THIS_ACTION));
          if (isJson(res.result.output)) {
            const treeBlock = new TreeBuilder(JSON.parse(res.result.output));
            this.child.replace(treeBlock);
            this.child = treeBlock;
          } else {
            const noJsonBlock = new BaseComponent(Tags.DIV, [
              'output_inner',
              'output_json-block'
            ]);
            noJsonBlock.innerHTML = `${InnerTexts.NOT_JSON}
          ${res.result.output}`;
            this.child.replace(noJsonBlock);
            this.child = noJsonBlock;
          }
          if (res.result.raw_data) {
            BEAM.callApi(RC.invokeData(THIS_INVOKE_DATA, res.result.raw_data));
          }
          break;

        case THIS_INVOKE_DATA:
          BEAM.callApi(RC.txStatus(THIS_TX_STATUS, res.result.txid));
          break;

        case THIS_TX_STATUS:
          if (res.result.status_string === ResTXStatus.IN_PROGRESS) {
            setTimeout(() => {
              BEAM.callApi(RC.txStatus(THIS_TX_STATUS, res.result.txId));
            }, ShaderProps.TX_CHECK_INTERVAL);
          } else {
            console.log(res);
          }
          break;
        default:
          break;
      }
    }
  };
}
