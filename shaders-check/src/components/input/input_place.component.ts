import { APIResponse } from 'beamApiProps';
import { ReqID } from '../../constants/variables';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import { Form } from './form.component';
import { BEAM } from '../../controllers/beam.controller';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
    BEAM.addObservers(this);
  }

  inform = (res: APIResponse): void => {
    if (res.error) {
      console.log(res.error?.code);
      // if (this.element.hasChildNodes()) {
      //   this.element.remove();
      // }
    } else if (res.id === ReqID.FORM_GENERATOR) {
      this.removeAll();
      this.append(new Form(JSON.parse(res.result.output)));
    }
  };
}
