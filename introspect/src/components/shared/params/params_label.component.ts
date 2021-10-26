import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';
import { ParamsInput } from './params_input.component';

export class ParamsLabel extends BaseComponent {
  constructor(
    param:[string, string],
    addObserver: (component: ParamsInput) => void
  ) {
    super(Tags.DIV, ['params__label']);
    const [key, value] = param;
    this.setAttributes({ for: key });
    this.append(
      this.createParamName(key, value), new ParamsInput(key, addObserver)
    );
  }

  createParamName = (
    key: string, value: string
  ):BaseComponent => {
    const nameComponent = new BaseComponent(Tags.DIV, ['name']);
    const keyComponent = new BaseComponent(Tags.SPAN);
    const valueComponent = new BaseComponent(Tags.SPAN);
    keyComponent.textContent = `${key}:`;
    valueComponent.textContent = value;
    nameComponent.append(keyComponent, valueComponent);
    return nameComponent;
  };
}
