import { IAppState } from 'AppStateProps';
import { AppStateHandler } from '../../logic/app_state/state.handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';

export default class InfoBLock extends BaseComponent {
  key: string;

  title: string;

  value: string | number;

  constructor({ key, title, value }:
  { key:string, title: string, value: string | number }) {
    super(Tags.DIV, ['infoblock']);
    AppStateHandler.addObservers(this);
    this.key = key;
    this.title = title;
    this.value = value;
    this.render();
  }

  render = ():void => {
    this.innerHTML = `${this.title}: ${this.value}`;
  };

  appInform = (state: IAppState):void => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(this.key)) {
      this.value = state[this.key];
      this.render();
    }
  };
}
