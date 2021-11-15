import { Tags } from '@constants/html-elements';
import BaseComponent from '../base/base.component';

export default class FlexContainer extends BaseComponent {
  constructor(...components: BaseComponent[]) {
    super(Tags.DIV, ['container']);
    this.style.display = 'flex';
    this.append(...components);
  }

  setJustify = (
    justifyContent: 'space-between'
    | 'space-around' | 'flex-start' | 'flex-end' | 'center'
  ):this => {
    this.style.justifyContent = justifyContent;
    return this;
  };

  setAlign = (alignItems: 'flex-start' | 'flex-end' | 'center'):this => {
    this.style.alignItems = alignItems;
    return this;
  };

  flexWrap = (flexWrap: 'wrap' | 'nowrap' | 'wrap-reverse'):this => {
    this.style.flexWrap = flexWrap;
    return this;
  };
}
