import { IActionParams } from 'beamApiProps';
import { InformArgs } from 'formProps';
import { Tags } from '../../../constants/html_elements';
import { FormActions } from '../../../constants/variables';
import BaseComponent from '../base/base.component';

export class ParamsInput extends BaseComponent {
  readonly param: string;

  constructor(
    param: string,
    addObserver: (component: ParamsInput) => void
  ) {
    super(Tags.INPUT, ['params__input']);
    this.param = param;
    addObserver(this);
    this.setAttributes(
      {
        placeholder: '',
        value: ''
      }
    );
  }

  public valueChanger = (params: IActionParams):void => {
    const el = this.element as HTMLInputElement;
    el.value = params[this.param] as string;
  };

  formInform = ({ formAction, currentParams }:InformArgs):void => {
    if (formAction === FormActions.SET_PARAM_VALUE) {
      this.setAttributes({
        value: currentParams[this.param]
      });
    }
  };
}
