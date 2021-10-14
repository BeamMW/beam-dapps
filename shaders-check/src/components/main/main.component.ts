import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import DropPage from '../drop_page/drop_page.component';
import { BEAM } from '../../controllers/beam.controller';
import Header from '../header/header.component';
import { ReqID } from '../../constants/variables';
import { Form } from '../input/form.component';

export default class Main extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['main']);
    BEAM.addObservers(this);
    this.append(new DropPage());
  }

  inform = (res: APIResponse): void => {
    if (res.error) {
      console.log(res.error?.code);
    } else if (res.id === ReqID.FORM_GENERATOR) {
      this.removeAll();
      this.append(new Header(), new Form(JSON.parse(res.result.output)));
    }
  };
}
