import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './greeting.scss';

export default class Greeting extends BaseComponent {
  title: string;

  desc: string;

  constructor(title:string, desc:string) {
    super(Tags.DIV, ['description']);
    this.title = title;
    this.desc = desc;
    const titleDom = new BaseComponent(Tags.SPAN, ['title']);
    const descDom = new BaseComponent(Tags.SPAN, ['desc']);
    titleDom.element.textContent = title;
    descDom.element.textContent = desc;
    this.append(titleDom, descDom);
  }
}
