import { IAppState } from 'AppStateProps';
import { AC } from '../../logic/store/app_action_creators';
import { Tags } from '../../constants/html_tags';
import { Store } from '../../logic/store/state_handler';
import BaseComponent from '../base/base.component';

const options: ['OFF', 'ON'] = ['OFF', 'ON'];

export default class AutoPlayOpt extends BaseComponent {
  private readonly modeLabel: BaseComponent;

  private readonly radioButton: BaseComponent[];

  constructor() {
    super(Tags.DIV, ['mode']);
    Store.addObservers(this);
    const { autoPlay } = Store.getState();
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
      radio.checked = !!i === autoPlay;
      label.style.color = !!i === autoPlay
        ? '#80ffdb'
        : '';

      radio.element.addEventListener('input', () => {
        Store.dispatch(AC.setAutoplay(!!i));
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
