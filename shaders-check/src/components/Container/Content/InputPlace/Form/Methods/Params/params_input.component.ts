import { InformArgs } from 'formProps';
import { Tags } from '../../../../../../../constants/html_elements';
import { FormActions } from '../../../../../../../constants/variables';
import BaseComponent from '../../../../../../shared/base/base.component';

export class ParamsInput extends BaseComponent {
  private readonly param: string;

  constructor(
    param: string
  ) {
    super(Tags.INPUT, ['params__input']);
    this.param = param;
    this.setAttributes(
      {
        placeholder: this.param,
        value: ''
      }
    );
    this.element.addEventListener('change', (e:Event) => {
      const target = e.target as HTMLInputElement;
      console.log(target);
    });
  }

  formInform = ({ formAction, currentParams }:InformArgs):void => {
    if (formAction === FormActions.SET_PARAM_VALUE) {
      this.setAttributes({
        value: currentParams[this.param]
      });
    }
  };
}
