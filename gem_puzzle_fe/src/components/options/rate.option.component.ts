import { IAppState } from 'AppStateProps';
import { AC } from '../../logic/store/app_action_creators';
import { Store } from '../../logic/store/state_handler';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import { handleString, parseToGroth } from '../../utils/string_handlers';

export default class Rate extends BaseComponent {
  rateInput: BaseComponent;

  constructor() {
    super(Tags.DIV, ['form', 'rate']);
    Store.addObservers(this);
    const { rate } = Store.getState();
    const rateLabel = new BaseComponent(Tags.LABEL);
    rateLabel.setAttributes({
      for: 'rate'
    });
    rateLabel.innerHTML = 'rate';
    this.rateInput = new BaseComponent(Tags.INPUT);
    this.rateInput.setAttributes({
      id: 'rate',
      type: 'text',
      autocomplete: 'off',
      value: String(rate)
    });
    this.rateInput.element.addEventListener('input', (e:Event) => {
      const target = e.target as HTMLInputElement;
      if (handleString(target.value)) {
        Store.dispatch(AC.setRate(+target.value));
      } else {
        target.value = String(Store.getState().rate);
      }
    });
    this.append(this.rateInput, rateLabel);
  }

  appInform = (state:IAppState):void => {
    const { rate } = state;
    parseToGroth(rate);
    this.rateInput.setAttributes({
      value: String(rate)
    });
  };
}
