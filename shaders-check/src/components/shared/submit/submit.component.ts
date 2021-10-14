import { STORE } from '../../../controllers/store.controller';
import { RC } from '../../../logic/beam/request_creators';
import { BEAM } from '../../../controllers/beam.controller';
import BaseComponent from '../base/base.component';
import { Tags } from '../../../constants/html_elements';
import { SVG } from '../../../constants/svg.icons';
import { setOnloadAC } from '../../../logic/store/action_creators';

export class Submit extends BaseComponent {
  constructor(action:string, callback: () => string) {
    super(Tags.BUTTON, ['button', 'submit']);
    (<HTMLInputElement> this.element).value = 'execute';
    this.innerHTML = `${SVG.iconDone} execute`;
    this.element.setAttribute('type', 'submit');
    this.element.addEventListener('click', () => {
      BEAM.callApi(RC.submitResult(action, callback()));
      STORE.dispatch(setOnloadAC(action));
    });
  }
}
