import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../base/base.component';

export default class FlexContainer extends BaseComponent {
  constructor(...components: BaseComponent[]) {
    super(Tags.DIV, ['container']);
    this.style.display = 'flex';
    this.append(...components);
  }

  setJustify = (
    str: 'space-between' | 'space-around' | 'flex-start' | 'flex-end' | 'center'
  ):FlexContainer => {
    this.style.justifyContent = str;
    return this;
  };

  setAlign = (str: 'flex-start' | 'flex-end' | 'center'):FlexContainer => {
    this.style.alignItems = str;
    return this;
  };
}
