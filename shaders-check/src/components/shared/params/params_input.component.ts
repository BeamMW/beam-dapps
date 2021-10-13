import { IActionParams } from 'beamApiProps';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';

export class ParamsInput extends BaseComponent {
  readonly param: string;

  constructor(
    param: string,
    addObserver: (component: ParamsInput) => void
  ) {
    super(Tags.INPUT, ['params__input']);
    this.param = param;
    this.setAttributes(
      {
        placeholder: '',
        value: ''
      }
    );
    addObserver(this);
  }

  public valueChanger = (params: IActionParams):void => {
    const el = this.element as HTMLInputElement;
    if (params[this.param] !== el.value) {
      el.value = params[this.param] as string;
    }
  };
}
