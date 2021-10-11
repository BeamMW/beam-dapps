import { RC } from '../../../../../../../logic/beam/request_creators';
import { BEAM } from '../../../../../../controllers/beam.controller';
import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';

export class Submit extends BaseComponent {
  constructor(action:string, callback: () => string) {
    super(Tags.BUTTON, ['submit']);
    (<HTMLInputElement> this.element).value = 'Send Request';
    this.textContent = 'Send Request';
    this.element.setAttribute('type', 'submit');
    this.element.addEventListener('click', () => {
      BEAM.callApi(RC.submitResult(action, callback()));
    });
  }
}
