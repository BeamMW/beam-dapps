import { IActionParams } from 'beamApiProps';
import { FormDispatch } from 'formProps';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { setActionAC } from '../../../../../../../utils/action_creators';

export class ValueInput extends BaseComponent {
  constructor(
    action:[string, IActionParams],
    currentAction:string,
    dispatch:FormDispatch
  ) {
    super(Tags.INPUT, ['method__input']);
    this.element.id = action[0];
    (this.element as HTMLInputElement).checked = currentAction === action[0];
    this.setAttributes({ type: 'radio', name: 'method' });
    this.element.addEventListener('change', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        dispatch(setActionAC({ action: this.element.id, params: action[1] }));
        e.stopPropagation();
      }
    });
  }
}
