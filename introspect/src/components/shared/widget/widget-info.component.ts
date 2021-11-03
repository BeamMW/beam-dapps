import { APIResponse } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';
import { BEAM } from '../../../controllers';
import { makeDotted } from '../../../utils/string-handlers';
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
    BEAM.subscribe(this);
    const titleSpan = new BaseComponent(Tags.TD, ['title']);
    titleSpan.textContent = title;
    this.value = new BaseComponent(Tags.TD, ['value']);
    this.key = key;
    this.action = action;
    this.value.textContent = value;
    this.append(titleSpan, this.value);
  }

  inform = (res: APIResponse): void => {
    if (res.id === this.action) {
      this.value.textContent = makeDotted(res.result[this.key]);
    }
  };
}
