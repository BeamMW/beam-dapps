import { IAppState } from 'AppStateProps';
import { AppStateHandler } from '../../logic/app_state/state.handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';

export default class InfoBLock extends BaseComponent {
  key: string;

  title: string;

  value: string | number;

  after: string;

  callback?: (numb:number) => string;

  constructor({
    key,
    title,
    value,
    after = '',
    callback
  }: {
    key: string;
    title: string;
    value: string | number;
    after: string;
    callback?: (numb:number) => string;
  }) {
    super(Tags.DIV, ['infoblock']);
    AppStateHandler.addObservers(this);
    this.key = key;
    this.title = title;
    this.value = value;
    this.after = after;
    if (callback) this.callback = callback;
    this.render();
  }

  render = (): void => {
    this.innerHTML = `${this.title}: ${this.value} ${this.after}`;
  };

  appInform = (state: IAppState): void => {
    if (this.key in state) {
      if (this.value !== state[this.key]) {
        this.value = this.callback
          ? this.callback(state[this.key])
          : state[this.key];
        this.render();
      }
    }
  };
}
