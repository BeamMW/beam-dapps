import { APIResponse } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';
import { ResTXStatus } from '../../constants/api_constants';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import BaseComponent from '../base/base.component';
import './footer.scss';

export default class Footer extends BaseComponent {
  private timeoutId: null | NodeJS.Timeout;

  errorBlock: BaseComponent;

  // loaderBlock: BaseComponent;

  constructor() {
    super(Tags.DIV, ['footer']);
    this.timeoutId = null;
    this.errorBlock = new BaseComponent(Tags.DIV, ['errorBlock']);
    // this.loaderBlock = new TxBoard();
    ApiHandler.addObservers(this);
    this.append(this.errorBlock);
  }

  private readonly viewMessage = (message:string) => {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.errorBlock.innerHTML = message;
    this.errorBlock.classList.add('active');
    this.timeoutId = setTimeout(() => {
      this.errorBlock.classList.remove('active');
      this.timeoutId = setTimeout(() => {
        this.errorBlock.innerHTML = '';
        this.timeoutId = null;
      }, 300);
    }, 5000);
  };

  inform = (res: APIResponse):void => {
    if (res.error) {
      this.viewMessage(res.error.message);
    } else if (res.result.status_string === ResTXStatus.FAILED) {
      this.viewMessage(res.result.failure_reason);
    } else if (res.result?.output) {
      try {
        const output = JSON.parse(res.result?.output);
        console.log('output JSON', output);
      } catch (error) {
        this.viewMessage(error as string);
        console.log('output not JSON', res.result.output);
      }
    }
  };
}
