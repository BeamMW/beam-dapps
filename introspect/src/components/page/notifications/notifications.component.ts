import { IFormState } from '@alltypes';
import { BaseComponent, Widget } from '@components/shared';
import { Tags } from '@constants/html-elements';
import { STORE } from '@logic/controllers';
import './notifications.scss';

export default class Notifications extends BaseComponent {
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
