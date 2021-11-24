import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';
import './simple-button.scss';

class Button extends BaseComponent {
  constructor({
    name,
    action,
    tag = Tags.BUTTON,
    type = '',
    classes = (str:string) => [str]
  }:{
    name: string;
    action: string;
    tag?: Tags,
    icon?: string;
    type?: string;
    classes?: (action:string) => string[];
  }) {
    super(tag, ['simple-button', ...classes(action)]);
    const title = new BaseComponent(Tags.SPAN);
    title.innerHTML = name;
    this.setAttributes({
      type
    });
    this.append(title);
  }

  addEventListener = (type:string, callback: (e?:Event) => void):void => {
    this.element.addEventListener(type, callback);
  };
}

export default Button;
