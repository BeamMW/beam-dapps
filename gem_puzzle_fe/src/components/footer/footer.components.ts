import { APIResponse } from 'beamApiProps';
import { ResTXStatus } from '../../constants/api_constants';
import { Tags } from '../../constants/html_tags';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import BaseComponent from '../base/base.component';
import './footer.scss';

export default class Footer extends BaseComponent {
  private timeoutId: null | NodeJS.Timeout;

  constructor() {
    super(Tags.DIV, ['footer']);
    this.timeoutId = null;
    ApiHandler.addObservers(this);
  }

  private readonly viewMessage = (message:string) => {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.innerHTML = message;
    this.classList.add('active');
    this.timeoutId = setTimeout(() => {
      this.classList.remove('active');
      this.timeoutId = setTimeout(() => {
        this.innerHTML = '';
        this.timeoutId = null;
      }, 300);
    }, 2000);
  };

  inform = (res: APIResponse):void => {
    if (res.error) {
      this.viewMessage(res.error.message);
    } else if (res.result.status_string === ResTXStatus.FAILED) {
      this.viewMessage(res.result.failure_reason);
    } else if (res.result?.output) {
      try {
        const output = JSON.parse(res.result?.output);
        console.log(output);
      } catch (error) {
        this.viewMessage(error as string);
      }
    }
  };
}
