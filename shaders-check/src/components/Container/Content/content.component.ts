import { InputPlace } from './InputPlace/input_place.component';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../../shared/base/base.component';
// import { OutputPlace } from './OutputPlace/output_place.component';
import { BEAM } from '../../controllers/beam.controller';

export default class Content extends BaseComponent {
  private readonly inputPlace: InputPlace;

  // private readonly outputPlace: OutputPlace;

  constructor() {
    super(Tags.DIV, ['container__content', 'container']);
    this.inputPlace = new InputPlace();
    // this.outputPlace = new OutputPlace();
    // this.outputPlace.setAttributes({ id: 'input__place' });
    BEAM.addObservers(this.inputPlace);
    this.append(this.inputPlace);
    // , this.outputPlace
  }
}
