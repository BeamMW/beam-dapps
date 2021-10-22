import { IFormState } from 'formProps';
import { Tags } from '../../constants/html_elements';
import { STORE } from '../../controllers/store.controller';
import { AC } from '../../logic/store/action_creators';
import BaseComponent from '../shared/base/base.component';
import './header.scss';

const headerData = [
  {
    title: 'Connect to contract status',
    data: 'connected',
    callback(state: IFormState, component: BaseComponent) {
      if (state.error.msg !== '') {
        setTimeout(() => {
          component.textContent = 'connected';
          STORE.dispatch(AC.setError({ msg: '', code: null, data: '' }));
        }, 5000);
        component.textContent = !state.error.data
          ? state.error.msg
          : state.error.data;
      }
    }
  },
  {
    title: 'Name:',
    data: '',
    callback(state: IFormState, component: BaseComponent) {
      if (state.fileName !== component.textContent) {
        component.textContent = state.fileName;
      }
    }
  },
  {
    title: 'Active transactions:',
    data: '0/3',
    callback: (state: IFormState, component: BaseComponent) => {
      const txCount = state.txs.size;
      component.textContent = `${txCount}/3`;
    }
  }
];

export default class InfoBlock extends BaseComponent {
  constructor() {
    super(Tags.TABLE, ['header__info']);
    const headerElemens = headerData.map((data) => {
      const component = new BaseComponent(Tags.TR, ['info__titles']);
      const title = new BaseComponent(Tags.TD, ['info__title']);
      const message = new BaseComponent(Tags.TD, ['info__data']);
      title.textContent = data.title;
      message.textContent = data.data;
      message.informForm = (state: IFormState) => data.callback(state, message);
      STORE.subscribe(message);
      component.append(title, message);
      return component;
    });
    this.append(...headerElemens);
  }
}
