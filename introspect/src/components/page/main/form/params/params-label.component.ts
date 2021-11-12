import { IFormState } from '@alltypes';
import { BaseComponent, ParamsInput } from '@components/shared';
import { Tags } from '@constants/html-elements';
import { STORE } from '@logic/controllers';

export class ParamsLabel extends BaseComponent {
  constructor(
    param:[string, string],
    subscribe: (component: ParamsInput) => void
  ) {
    super(Tags.DIV, ['params__label']);
    const [key, value] = param;
    this.setAttributes({ for: key });
    const input = new ParamsInput(key);
    subscribe(input);
    if (key === 'cid') this.paramStoreDecorator(input);
    this.append(this.createParamName(key, value), input);
  }

  paramStoreDecorator = (component: ParamsInput):void => {
    component.informForm = (store: IFormState) => {
      if (store.defaultCid) {
        (<HTMLInputElement>component.element).value = store.defaultCid;
        component.element.dispatchEvent(new Event('input'));
      }
    };
    STORE.subscribe(component);
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
