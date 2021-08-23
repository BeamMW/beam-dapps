import { Tags } from '../../../../../../../constants/html_elements';
import { setActionAC } from '../../../../../../../utils/action_creators';
import BaseComponent from '../../../../../../BaseComponent/base.component';

export class ValueInput extends BaseComponent {
  constructor(action:any, currentAction:any, dispatch:any) {
    super(Tags.INPUT, ['method__input']);
    this.element.id = action[0];
    (this.element as HTMLInputElement).checked = currentAction === action[0];
    this.setAttributes({ type: 'radio', name: 'method' });
    this.element.addEventListener('change', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        dispatch(setActionAC(this.element.id));
      }
    });
  }
}
