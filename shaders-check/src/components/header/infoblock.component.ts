import { APIResponse } from 'beamApiProps';
import { IFormState } from 'formProps';
import { Tags } from '../../constants/html_elements';
import { BEAM } from '../../controllers/beam.controller';
import { STORE } from '../../controllers/store.controller';
import { AC } from '../../logic/store/action_creators';
import BaseComponent from '../shared/base/base.component';
import './header.scss';

export default class InfoBlock extends BaseComponent {
  dataName: BaseComponent;

  dataStatus: BaseComponent;

  constructor() {
    super(Tags.TABLE, ['header__info']);
    BEAM.addObservers(this);
    STORE.addObserver(this);
    const titlesStatus = new BaseComponent(Tags.TD, ['info__titles']);
    const titlesId = new BaseComponent(Tags.TD, ['info__titles']);
    const titlesName = new BaseComponent(Tags.TD, ['info__titles']);
    this.dataStatus = new BaseComponent(Tags.TD, ['info__data']);
    const dataId = new BaseComponent(Tags.TD, ['info__data']);
    this.dataName = new BaseComponent(Tags.TD, ['info__data']);

    const trStatus = new BaseComponent(Tags.TR);
    // const trId = new BaseComponent(Tags.TR);
    const trName = new BaseComponent(Tags.TR);

    titlesStatus.textContent = 'Connect to contract status:';
    titlesId.textContent = 'ID shaders:';
    titlesName.textContent = 'Name:';
    this.dataStatus.textContent = 'connected';
    // dataId.textContent = '38234c93434ebb572a22bab82799f9ffa0ddfcc9e0687a2a9a61ce055bdd5c42';
    this.dataName.textContent = '';

    trStatus.append(titlesStatus, this.dataStatus);
    // trId.append(titlesId, dataId);
    trName.append(titlesName, this.dataName);
    this.append(trStatus, trName);
  }

  informForm = (state: IFormState): void => {
    if (state.fileName !== this.dataName.textContent) {
      this.dataName.textContent = state.fileName;
      console.log(state);
    }
    if (state.errMsg !== '') {
      setTimeout(() => {
        this.dataName.textContent = state.fileName;
        this.dataStatus.textContent = 'connected';
        STORE.dispatch(AC.setErrMsg(''));
        STORE.dispatch(AC.setErrCode(null));
        STORE.dispatch(AC.setErrData(''));
      }, 5000);
      this.dataName.textContent = state.errMsg;
      this.dataStatus.textContent = !state.errData ? `
      CODE: ${state.errCode}` : state.errData;
    }
  };

  inform = (res: APIResponse): void => {
    if (res.error) {
      STORE.dispatch(AC.setErrMsg(res.error.message));
      STORE.dispatch(AC.setErrData(res.error.data));
      STORE.dispatch(AC.setErrCode(res.error.code));
    }
  };
}
