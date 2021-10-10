import { IActionParams } from 'beamApiProps';
import { Params } from '../Params/params_value.component';
import BaseComponent from '../../../../../../shared/base/base.component';
import { Tags } from '../../../../../../../constants/html_elements';
import { ValueInput } from './action_input.component';
import { SVG } from '../../../../../../../constants/svg.icons';

export class ValueLabel extends BaseComponent {
  input: ValueInput;

  methodAction: BaseComponent;

  constructor(
    action: [string, IActionParams],
    currentAction: string
  ) {
    super(Tags.LABEL, ['method__label', 'custom-radio']);
    this.input = new ValueInput(action, currentAction);
    const title = new BaseComponent(Tags.DIV, ['method__label-title']);
    const span = new BaseComponent(Tags.SPAN);
    span.textContent = action[0] as string;
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    arrowDown.innerHTML = `${SVG.iconArrowDown}`;
    this.methodAction = new BaseComponent(Tags.DIV, ['output__place']);
    this.methodAction.append(new Params(action[1]));
    this.setAttributes({ for: span.element.innerText });
    title.element.addEventListener('click', (e) => {
      title.element.classList.toggle('active');
      if (this.methodAction.element.style.display === 'block') {
        this.methodAction.element.style.display = 'none';
        console.log(2);
      } else {
        this.methodAction.element.style.display = 'block';
        console.log(3);
      }
      e.preventDefault();
    });
    title.append(this.input, span, arrowDown);
    this.append(title, this.methodAction);
  }
}
