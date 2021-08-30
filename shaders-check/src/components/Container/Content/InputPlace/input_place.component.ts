import { APIResponse } from 'beamApiProps';
import { ReqID } from '../../../../constants/variables';
import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';
import { Form } from './Form/form.component';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
  }

  inform = (res: APIResponse): void => {
    if (res.id === ReqID.FORM_GENERATOR) {
      this.removeAll();
      console.log(res);
      this.append(new Form(JSON.parse(res.result.output)));
    }
  };
}
