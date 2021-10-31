import { IFormState } from 'formProps';
import { Tags } from '../../../constants/html_elements';
import { STORE } from '../../../controllers/store.controller';
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
    const input = new ParamsInput(key, addObserver);
    if (key === 'cid') this.paramStoreDecorator(input);
    this.append(
      this.createParamName(key, value), input
    );
  }

  paramStoreDecorator = (component: ParamsInput):void => {
    STORE.subscribe(component);
    component.informForm = (store: IFormState) => {
      if (store.defaultCid) {
        (<HTMLInputElement>component.element).value = store.defaultCid;
        component.element.dispatchEvent(new Event('input'));
      }
    };
  };

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
