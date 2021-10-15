import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import DropPage from '../drop_page/drop_page.component';
import { BEAM } from '../../controllers/beam.controller';
import Header from '../header/header.component';
import { ErrorResponses, ReqID } from '../../constants/variables';
import { Form } from '../input/form.component';
import Transactions from '../transactions/transactions.component';

export default class Main extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['main']);
    BEAM.addObservers(this);
    this.append(new DropPage());
  }

  inform = (res: APIResponse): void => {
    if (res.error) {
      switch (res.error.message) {
        case ErrorResponses.CALL_FAILED:
          document.location.reload();
          // TODO
          break;
        case ErrorResponses.REJECTED:
          // TODO
          break;
        default:
          break;
      }
    } else if (res.id === ReqID.FORM_GENERATOR) {
      this.removeAll();
      this.append(
        new Header(),
        new Form(JSON.parse(res.result.output)),
        new Transactions()
      );
    }
  };
}
