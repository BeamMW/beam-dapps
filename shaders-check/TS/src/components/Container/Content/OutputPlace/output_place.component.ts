import { Tags } from '../../../../constants/html_elements';
import BaseComponent from '../../../BaseComponent/base.component';

export class OutputPlace extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['output__place']);
  }

  inform = (_json:string):void => {
    console.log(':3');
  };
}
