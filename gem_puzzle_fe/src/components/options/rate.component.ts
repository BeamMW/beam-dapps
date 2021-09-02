import { IAppState } from 'AppStateProps';
import { setRateAC } from '../../logic/app_state/app_action_creators';
import { AppStateHandler } from '../../logic/app_state/state.handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';

export default class Rate extends BaseComponent {
  rateInput: BaseComponent;

  constructor() {
    super(Tags.DIV, ['rate']);
    AppStateHandler.addObservers(this);
    const { rate } = AppStateHandler.getState();
    const rateLabel = new BaseComponent(Tags.LABEL);
    rateLabel.setAttributes({
      for: 'rate'
    });
    rateLabel.innerHTML = 'rate';
    this.rateInput = new BaseComponent(Tags.INPUT);
    this.rateInput.setAttributes({
      id: 'rate',
      type: 'text',
      value: String(rate)
    });
    this.rateInput.element.addEventListener('input', (e:Event) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      if (target.value.match(/^\d+$/) || target.value === '') {
        AppStateHandler.dispatch(setRateAC(+target.value));
      } else {
        target.value = String(AppStateHandler.getState().rate);
      }
    });
    this.append(rateLabel, this.rateInput);
  }

  appInform = (state:IAppState):void => {
    const { rate } = state;
    this.rateInput.setAttributes({
      value: String(rate)
    });
  };
}
