import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';

export default class Canvas extends BaseComponent {
  constructor() {
    super(Tags.CANVAS, ['canvas']);
    // const ctx = (this.element as HTMLCanvasElement).getContext('2d');
    BaseComponent.apiHandler.addObservers(this);
  }

  inform = (json:string) => {
    console.log(json);
  };
}
