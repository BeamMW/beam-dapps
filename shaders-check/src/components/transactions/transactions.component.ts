import { IFormState } from 'formProps';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import './transactions.scss';
import Widget from '../shared/widget/widget.component';
import { STORE } from '../../controllers/store.controller';

export default class Transactions extends BaseComponent {
  length = STORE.getState().txs.size;

  constructor() {
    super(Tags.DIV, ['widgets']);
    STORE.subscribe(this);
    const widgets = [...STORE.getState().txs].map(
      (tx) => new Widget(tx, this.remove)
    );
    this.append(...widgets);
  }

  informForm = (store:IFormState): void => {
    if (store.txs.size !== this.length) {
      if (store.txs.size > this.length) {
        const value = [...store.txs][store.txs.size - 1];
        this.insertFirst(new Widget(<[string, string]>value, this.remove));
      }
      this.length = store.txs.size;
    }
  };
}
