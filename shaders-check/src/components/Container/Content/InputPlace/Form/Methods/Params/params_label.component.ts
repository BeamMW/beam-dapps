import { AddObsever, FormDispatch } from 'formProps';
import { Tags } from '../../../../../../../constants/html_elements';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { ParamsInput } from './params_input.component';

export class ParamsLabel extends BaseComponent {
  input: ParamsInput;

  constructor(
    role:string,
    dispatch: FormDispatch,
    addObserver: AddObsever
  ) {
    super(Tags.LABEL, ['params__label']);
    this.input = new ParamsInput(role, dispatch, addObserver);
    this.setAttributes({ for: role });
    this.append(this.input);
  }
}
