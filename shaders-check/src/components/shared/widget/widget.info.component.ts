import { APIResponse } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';
import { BEAM } from '../../../controllers/beam.controller';
import BaseComponent from '../base/base.component';

export default class WidgetProps extends BaseComponent {
  value: BaseComponent;

  key: string;

  action: string;

  constructor({
    value, key, title, action
  }:{
    value: string, key: string, title: string, action: string
  }) {
    super(Tags.TR, ['tx-infoblock']);
    BEAM.addObservers(this);
    const titleSpan = new BaseComponent(Tags.TD, ['title']);
    titleSpan.innerHTML = title;
    this.value = new BaseComponent(Tags.TD, ['value']);
    this.key = key;
    this.action = action;
    this.value.innerHTML = value;
    this.append(titleSpan, this.value);
  }

  inform = (res: APIResponse): void => {
    if (res.id === this.action) {
      this.value.innerHTML = res.result[this.key];
    }
  };
}