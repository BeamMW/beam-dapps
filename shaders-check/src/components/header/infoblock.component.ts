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
    BEAM.subscribe(this);
    STORE.subscribe(this);
    const titlesStatus = new BaseComponent(Tags.TD, ['info__titles']);
    const titlesName = new BaseComponent(Tags.TD, ['info__titles']);
    this.dataStatus = new BaseComponent(Tags.TD, ['info__data']);
    this.dataName = new BaseComponent(Tags.TD, ['info__data']);

    const trStatus = new BaseComponent(Tags.TR);
    const trName = new BaseComponent(Tags.TR);

    titlesStatus.textContent = 'Connect to contract status:';
    titlesName.textContent = 'Name:';
    this.dataStatus.textContent = 'connected';
    this.dataName.textContent = '';

    trStatus.append(titlesStatus, this.dataStatus);
    trName.append(titlesName, this.dataName);
    this.append(trStatus, trName);
  }

  informForm = (state: IFormState): void => {
    if (state.fileName !== this.dataName.textContent) {
      this.dataName.textContent = state.fileName;
    }
    if (state.error.msg !== '') {
      setTimeout(() => {
        this.dataName.textContent = state.fileName;
        this.dataStatus.textContent = 'connected';
        STORE.dispatch(AC.setError({ msg: '', code: null, data: '' }));
      }, 5000);
      this.dataName.textContent = state.error.msg;
      this.dataStatus.textContent = !state.error.data ? `
      CODE: ${state.error.code}` : state.error.data;
    }
  };
}
