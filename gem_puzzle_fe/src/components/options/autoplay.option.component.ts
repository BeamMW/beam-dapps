import { IAppState } from 'AppStateProps';
import {
  setAutoplayAC
} from '../../logic/app_state/app_action_creators';
import { Tags } from '../../constants/html_tags';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import BaseComponent from '../base/base.component';

const options: ['OFF', 'ON'] = ['OFF', 'ON'];

export default class AutoPlayOpt extends BaseComponent {
  private readonly modeLabel: BaseComponent;

  private readonly radioButton: BaseComponent[];

  constructor() {
    super(Tags.DIV, ['mode']);
    AppStateHandler.addObservers(this);
    const { picOpt } = AppStateHandler.getState();
    this.modeLabel = new BaseComponent(Tags.LABEL, ['title']);
    this.modeLabel.innerHTML = 'autoplay';
    this.modeLabel.setAttributes({
      for: 'mode'
    });
    this.radioButton = options.map((value, i) => {
      const label = new BaseComponent(Tags.LABEL, ['value']);
      const radio = new BaseComponent(Tags.INPUT);
      label.innerHTML = value.toLowerCase();
      radio.setAttributes({
        type: 'radio',
        'data-value': String(i)
      });
      radio.checked = value === picOpt;
      label.style.color = value === picOpt
        ? '#80ffdb'
        : '';

      radio.element.addEventListener('input', () => {
        AppStateHandler.dispatch(setAutoplayAC(!!i));
      });
      label.append(radio);
      return label;
    });

    this.append(...this.radioButton, this.modeLabel);
  }

  appInform = ({ autoPlay }: IAppState): void => {
    this.radioButton.forEach((label) => {
      const radio = label.element.children[0] as HTMLInputElement;
      const { value } = radio.dataset;
      if (value) {
        radio.checked = +value === +autoPlay;
        label.style.color = +value === +autoPlay
          ? '#80ffdb'
          : '';
      }
    });
  };
}
