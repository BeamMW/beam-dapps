import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './greeting.scss';

export default class Greeting extends BaseComponent {
  title: string;

  constructor(title: string) {
    super(Tags.DIV, ['description']);
    this.title = title;
    const titleDom = new BaseComponent(Tags.SPAN, ['title']);
    // const back = new BaseComponent(Tags.BUTTON, ['backBtn']);
    titleDom.element.textContent = title;
    // back.element.textContent = ' back to mane menu';
    // back.element.addEventListener('click', () => {
    //   window.history.pushState({}, '', `/${Routes.RETURN}`);
    // });
    this.append(titleDom);
  }
}
