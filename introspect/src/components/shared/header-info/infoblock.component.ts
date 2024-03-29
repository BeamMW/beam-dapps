import { IFormState } from '@alltypes';
import { Tags } from '@constants/html-elements';
import { headerData } from '@lib/data';
import { STORE } from '@logic/controllers';
import BaseComponent from '../base/base.component';

export default class InfoBlock extends BaseComponent {
  constructor() {
    super(Tags.TABLE, ['header__info']);
    const headerElemens = headerData.map((data) => {
      const component = new BaseComponent(Tags.TR, ['info__titles']);
      const title = new BaseComponent(Tags.TD, ['info__title']);
      const message = new BaseComponent(Tags.TD, ['info__data']);
      title.innerText(data.title);
      message.innerText(data.data);
      message.informForm = (state: IFormState) => data.callback(state, message);
      STORE.subscribe(message);
      component.append(title, message);
      return component;
    });
    this.append(...headerElemens);
  }
}
