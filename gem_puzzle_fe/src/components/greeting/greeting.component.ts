import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './greeting.scss';
import { GrState } from './greeting_state';

export default class Greeting extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['description']);
    const titleDom = new BaseComponent(Tags.SPAN, ['title']);
    titleDom.element.textContent = GrState.MainTitle;
    const descDom = new BaseComponent(Tags.SPAN, ['desc']);
    descDom.element.textContent = GrState.MainDesc;
    // const back = new BaseComponent(Tags.BUTTON, ['backBtn']);
    // back.element.textContent = ' back to mane menu';
    // back.element.addEventListener('click', () => {
    //   window.history.pushState({}, '', `/${Routes.RETURN}`);
    // });
    this.append(titleDom, descDom);
  }
}
