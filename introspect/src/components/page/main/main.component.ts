import { APIResponse } from '@alltypes';
import { BaseComponent } from '@components/shared';
import { ErrorResponses, ReqID } from '@constants/app-shader';
import { Tags } from '@constants/html-elements';
import { AC } from '@logic/action-creators';
import { BEAM, STORE } from '@logic/controllers';
import DropPage from '../drop/drop-page.component';
import FailPage from '../fail/fail-page.component';
import Notifications from '../notifications/notifications.component';
import Form from './form/form.component';
import Header from './header/header.component';

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
        new Notifications()
      );
    }
  };
}
