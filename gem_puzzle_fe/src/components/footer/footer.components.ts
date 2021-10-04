import { APIResponse } from 'beamApiProps';
import { HtmlTexts, Tags } from '../../constants/html';
import { ResTXStatus } from '../../constants/api';
import { Beam } from '../../logic/beam/api_handler';
import BaseComponent from '../base/base.component';
import img from '../../assets/icon/enefftee-logo-small.svg';
import './footer.scss';
import Widget from '../widget/widget.component';

export default class Footer extends BaseComponent {
  private timeoutId: null | NodeJS.Timeout;

  errorBlock: BaseComponent;

  constructor() {
    super(Tags.DIV, ['footer']);
    this.timeoutId = null;
    this.errorBlock = new BaseComponent(Tags.DIV, ['errorBlock']);
    const footerContent = new BaseComponent(Tags.DIV, ['footer-content']);
    const followBlock = new BaseComponent(Tags.P);
    const follow = new BaseComponent(Tags.SPAN, ['follow-txt']);
    follow.innerHTML = HtmlTexts.FOLLOW;
    const enefftee = new BaseComponent(Tags.A);
    enefftee.innerHTML = HtmlTexts.ENEFFTEE;
    enefftee.setAttributes({
      href: HtmlTexts.ENEFFTEE_HREF,
      target: '_blank'
    });
    const onTwitter = new BaseComponent(Tags.SPAN, ['on-twitter']);
    onTwitter.innerHTML = HtmlTexts.ON_TWITTER;
    const enefteeBlock = new BaseComponent(Tags.IMG);
    enefteeBlock.setAttributes({
      src: img
    });
    footerContent.append(followBlock, enefteeBlock);
    followBlock.append(follow, enefftee, onTwitter);
    Beam.addObservers(this);
    this.append(this.errorBlock, footerContent, new Widget());
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
        if (output.error) {
          this.viewMessage(output.error);
        }
      } catch (error) {
        this.viewMessage(error as string);
        console.log('output not JSON', res.result.output);
      }
    }
  };
}
