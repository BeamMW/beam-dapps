import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';

export class InputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['input__place']);
  }

  inform = (json:string):void => {
    console.log(json);
  };
}
