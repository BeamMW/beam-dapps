import { AddObsever, FormDispatch, InformArgs } from 'formProps';
import {
  unsubscribeBeforeRemoveAC,
  setParamValueAC
} from '../../../../../../../utils/action_creators';
import { Tags } from '../../../../../../../constants/html_elements';
import { FormActions } from '../../../../../../../constants/variables';
import BaseComponent from '../../../../../../BaseComponent/base.component';

export class ParamsInput extends BaseComponent {
  private readonly param: string;

  constructor(
    param: string,
    dispatch: FormDispatch,
    addObserver: AddObsever
  ) {
    super(Tags.INPUT, ['params__input']);
    addObserver(this);
    this.param = param;
    this.setAttributes(
      {
        placeholder: this.param,
        value: ''
      }
    );
    this.element.addEventListener('change', (e:Event) => {
      const target = e.target as HTMLInputElement;
      dispatch(setParamValueAC({
        key: this.param,
        value: target.value
      }));
    });
    this.element.addEventListener(
      'DOMNodeRemovedFromDocument',
      () => dispatch(unsubscribeBeforeRemoveAC(this))
    );
  }

  formInform = ({ formAction, currentParams }:InformArgs):void => {
    if (formAction === FormActions.SET_PARAM_VALUE) {
      this.setAttributes({
        value: currentParams[this.param]
      });
    }
  };
}
