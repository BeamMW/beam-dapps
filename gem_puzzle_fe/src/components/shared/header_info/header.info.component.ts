import { IAppState } from 'AppStateProps';
import { Store } from '../../../logic/store/state_handler';
import { Tags } from '../../../constants/html_tags';
import BaseComponent from '../../base/base.component';

export default class InfoBLock extends BaseComponent {
  key: string;

  title: string | HTMLElement;

  value: string | number | boolean;

  after: string;

  before: string;

  titleDOM: BaseComponent;

  valueDOM: BaseComponent;

  afterDOM?: BaseComponent;

  beforeDOM?: BaseComponent;

  callback?: ((numb:number) => string) | ((str:boolean) => string);

  constructor({
    key,
    title,
    value,
    after = '',
    before = '',
    callback
  }: {
    key: string;
    title: string | HTMLElement;
    value: string | number | boolean;
    after: string;
    before: string;
    callback?: ((numb:number) => string) | ((str:boolean) => string);
  }) {
    super(Tags.DIV, ['infoblock']);
    Store.addObservers(this);
    this.key = key;
    this.title = title;
    this.value = value;
    this.after = after;
    this.before = before;
    this.titleDOM = new BaseComponent(Tags.SPAN, ['title']);
    this.valueDOM = new BaseComponent(Tags.SPAN, ['value']);
    if (callback) this.callback = callback;
    this.append(this.titleDOM, this.valueDOM);
    if (this.before.length) {
      this.beforeDOM = new BaseComponent(Tags.SPAN, ['before']);
      this.append(this.titleDOM, this.beforeDOM, this.valueDOM);
    }
    if (this.after.length) {
      this.afterDOM = new BaseComponent(Tags.SPAN, ['after']);
      this.append(this.afterDOM);
    }
    this.render();
  }

  render = (): void => {
    this.titleDOM.innerHTML = `${this.title}  `;
    if (this.beforeDOM) {
      this.beforeDOM.innerHTML = ` ${this.before} `;
    }
    this.valueDOM.innerHTML = `${this.value} `;
    if (this.afterDOM) {
      this.afterDOM.innerHTML = ` ${this.after} `;
    }
  };

  appInform = (state: IAppState): void => {
    if (this.key in state) {
      if (this.value !== state[this.key]) {
        this.value = this.callback
          ? this.callback(state[this.key] as never)
          : state[this.key];
        this.render();
      }
    }
  };
}
