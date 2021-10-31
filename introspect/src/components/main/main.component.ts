import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_elements';
import BaseComponent from '../shared/base/base.component';
import DropPage from '../drop_page/drop_page.component';
import { BEAM } from '../../controllers/beam.controller';
import Header from '../header/header.component';
import { ErrorResponses, ReqID } from '../../constants/variables';
import { Form } from '../input/form.component';
import Transactions from '../transactions/transactions.component';
import { STORE } from '../../controllers/store.controller';
import { AC } from '../../logic/store/action-creators';
import FailPage from '../fail_page/fail_page.component';

export default class Main extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['main']);
    BEAM.subscribe(this);
    this.append(new DropPage());
  }

  inform = (res: APIResponse): void => {
    if (res.error) {
      switch (res.error.message) {
        case ErrorResponses.CALL_FAILED:
          this.removeAll();
          this.append(new FailPage(res.error));
          break;
        default:
          STORE.dispatch(AC.setError({
            msg: res.error.message, code: res.error.code, data: res.error.data
          }));
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
