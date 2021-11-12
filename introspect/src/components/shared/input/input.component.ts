import { IActionParams } from '@alltypes';
import { Tags } from '@constants/html-elements';
import BaseComponent from '../base/base.component';
import './input.scss';

class ParamsInput extends BaseComponent {
  readonly param: string;

  constructor(
    param: string
  ) {
    super(Tags.INPUT, ['params__input', `param-${param}`]);
    this.param = param;
    this.setAttributes(
      {
        placeholder: '',
        value: ''
      }
    );
  }

  public valueChanger = (params: IActionParams):void => {
    const el = this.element as HTMLInputElement;
    if (params[this.param] !== el.value) {
      el.value = params[this.param] as string;
    }
  };
}

export default ParamsInput;
