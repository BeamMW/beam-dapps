import { Tags } from '../../../constants/html';
import BaseComponent from '../../base/base.component';

export default class FlexContainer extends BaseComponent {
  constructor(selector: string, ...components: BaseComponent[]) {
    super(Tags.DIV, [selector]);
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

  setDirection = (
    direction: 'column' | 'row'
  ):this => {
    this.style.flexDirection = direction;
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
