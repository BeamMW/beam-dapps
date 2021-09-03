import { IAppState } from 'AppStateProps';
import { Tags } from '../../constants/html_tags';
import { setModeAC } from '../../logic/app_state/app_action_creators';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { boardSchemeMaker } from '../../utils/string_handlers';
import BaseComponent from '../base/base.component';

const boardLength: (3 | 4 | 5)[] = [3, 4, 5];

export default class Mode extends BaseComponent {
  private readonly modeLabel: BaseComponent;

  private readonly radioButton: BaseComponent[];

  constructor() {
    super(Tags.DIV, ['mode']);
    AppStateHandler.addObservers(this);
    const { mode } = AppStateHandler.getState();
    this.modeLabel = new BaseComponent(Tags.LABEL);
    this.modeLabel.innerHTML = 'mode';
    this.modeLabel.setAttributes({
      for: 'mode'
    });
    this.radioButton = boardLength.map((value) => {
      const label = new BaseComponent(Tags.LABEL);
      const radio = new BaseComponent(Tags.INPUT);
      label.innerHTML = boardSchemeMaker(value);
      radio.setAttributes({
        type: 'radio',
        'data-value': String(value)
      });
      radio.checked = value === mode;

      radio.element.addEventListener('input', () => {
        AppStateHandler.dispatch(setModeAC(value));
      });
      label.append(radio);
      return label;
    });

    this.append(this.modeLabel, ...this.radioButton);
  }

  appInform = ({ mode }: IAppState): void => {
    this.radioButton.forEach((label) => {
      const radio = label.element.children[0] as HTMLInputElement;
      const { value } = radio.dataset;
      if (value) {
        radio.checked = +value === mode;
      }
    });
  };
}
