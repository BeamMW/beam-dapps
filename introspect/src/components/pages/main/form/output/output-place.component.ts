import { APIResponse } from 'beamApiProps';
import { IFormState } from 'formProps';
import { RC } from '../../../../../logic/beam/request-creators';
import { AC } from '../../../../../logic/store/action-creators';
import { InnerTexts, Tags } from '../../../../../constants/html_elements';
import { isJson } from '../../../../../utils/string-handlers';
import {
  ReqID, ShaderProps
} from '../../../../../constants/variables';
import ReqJson from '../req-json/req-json.component';
import {
  BaseComponent, Loader, ParamsInput, TreeBuilder
} from '../../../../shared';
import './output-place.scss';
import { BEAM, STORE } from '../../../../../controllers';

class OutputPlace extends BaseComponent {
  action: string;

  child: BaseComponent;

  constructor(action: string, subscribe: (component: ParamsInput) => void) {
    super(Tags.DIV, ['output__place']);
    BEAM.subscribe(this);
    STORE.subscribe(this);

    const wrapper = new BaseComponent(Tags.DIV, ['output__container']);
    this.child = new BaseComponent(Tags.DIV, ['output_inner']);

    this.action = action;
    this.child.textContent = 'Fill in the parametres to check the method';

    wrapper.append(this.child);
    this.append(new ReqJson(action, subscribe), wrapper);
  }

  informForm = (state: IFormState): void => {
    if (state.onload.has(this.action)) {
      const loadingBlock = new BaseComponent(Tags.DIV, [
        'output_inner', 'output_loading-block'
      ]);
      loadingBlock.append(new Loader());
      this.child.replace(loadingBlock);
      this.child = loadingBlock;
    }
  };

  reqHandler = (output: string):void => {
    STORE.dispatch(AC.deleteOnload(this.action));
    if (isJson(output)) {
      const treeBlock = new TreeBuilder(JSON.parse(output), false);
      this.child.replace(treeBlock);
      this.child = treeBlock;
    } else {
      const noJsonBlock = new BaseComponent(Tags.DIV, [
        'output_inner', 'output_json-block'
      ]);
      noJsonBlock.textContent = `${InnerTexts.NOT_JSON}
    ${output}`;
      this.child.replace(noJsonBlock);
      this.child = noJsonBlock;
    }
  };

  createTx = (reqId: string, data: number[]):void => {
    if (STORE.getState().txs.size < ShaderProps.MAX_TX_COUNT) {
      BEAM.callApi(RC.invokeData(reqId, data));
    }
  };

  invokeData = (reqId: string, txId: string):void => {
    const uid = `${reqId}${Date.now()}`;
    STORE.dispatch(AC.setTxs({ key: uid, value: txId }));
  };

  inform = (res: APIResponse): void => {
    const THIS_INVOKE_DATA = `${ReqID.INVOKE_DATA}_${this.action}`;
    const THIS_TX_STATUS = `${ReqID.TX_STATUS}_${this.action}`;
    if (!res.error) {
      const { result } = res;
      const { output } = result;
      switch (res.id) {
        case this.action:
          this.reqHandler(output);
          if (result.raw_data) {
            this.createTx(THIS_INVOKE_DATA, result.raw_data);
          }
          break;

        case THIS_INVOKE_DATA:
          this.invokeData(THIS_TX_STATUS, result.txid);
          break;

        default:
          break;
      }
    }
  };
}

export default OutputPlace;
