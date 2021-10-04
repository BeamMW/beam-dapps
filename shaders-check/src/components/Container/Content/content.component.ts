import { InputPlace } from './InputPlace/input_place.component';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../../BaseComponent/base.component';
import { OutputPlace } from './OutputPlace/output_place.component';
import { ApiHandler } from '../../../utils/api_handlers';

export default class Content extends BaseComponent {
  private readonly inputPlace: InputPlace;

  private readonly outputPlace: OutputPlace;

  constructor() {
    super(Tags.DIV, ['container__content', 'container']);
    this.inputPlace = new InputPlace();
    this.outputPlace = new OutputPlace();
    this.outputPlace.setAttributes({ id: 'input__place' });
    ApiHandler.addObservers(this.inputPlace, this.outputPlace);
    this.append(this.inputPlace, this.outputPlace);
  }
}
