import { InformArgs, ParamPayloadArgsType } from 'formProps';
import { Tags } from '../../../../../../../constants/html_elements';
import { FormActions } from '../../../../../../../constants/variables';
import BaseComponent from '../../../../../../shared/base/base.component';
import './params.scss';

export class ParamsInput extends BaseComponent {
  private readonly param: string;

  constructor(
    param: string,
    callback: (obj:ParamPayloadArgsType) => void
  ) {
    super(Tags.INPUT, ['params__input']);
    this.param = param;
    this.setAttributes(
      {
        placeholder: '',
        value: ''
      }
    );
    this.element.addEventListener('input', (e:Event) => {
      const target = e.target as HTMLInputElement;
      callback({
        key: param,
        value: target.value
      });
      console.log(target);
    });
  }

  formInform = ({ formAction, currentParams }:InformArgs):void => {
    if (formAction === FormActions.SET_PARAM_VALUE) {
      this.setAttributes({
        value: currentParams[this.param]
      });
    }
    console.log(currentParams);
  };
}
