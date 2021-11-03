import { toDOMParser } from '../../../utils/string-handlers';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';

class Button extends BaseComponent {
  constructor({
    name,
    action,
    tag = Tags.BUTTON,
    type = '',
    icon = '',
    classes = (str:string) => [str]
  }:{
    name: string;
    action: string;
    tag?: Tags,
    icon?: string;
    type?: string;
    classes?: (action:string) => string[];
  }) {
    super(tag, ['button', ...classes(action)]);
    const svg = icon && toDOMParser(icon);
    const title = new BaseComponent(Tags.SPAN);
    title.textContent = name;
    this.setAttributes({
      type
    });
    this.append(title);
    if (svg) this.insertFirst(svg);
  }

  addEventListener = (type:string, callback: (e?:Event) => void):void => {
    this.element.addEventListener(type, callback);
  };
}

export default Button;
