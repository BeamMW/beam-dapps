import { InputPlace } from './InputPlace/input_place.component';
import { ObserverComponent } from '../../../beamAPI/beamAPI';
import { Tags } from '../../../constants/html_elements';
import BaseComponent from '../../BaseComponent/base.component';
import { OutputPlace } from './OutputPlace/output_place.component';

export default class Content extends BaseComponent {
  private readonly inputPlace: BaseComponent;

  private readonly outputPlace: BaseComponent;

  constructor(addObservers:(...components: ObserverComponent[]) => void) {
    super(Tags.DIV, ['container__content', 'container']);
    this.inputPlace = new InputPlace();
    this.outputPlace = new OutputPlace();
    this.outputPlace.setAttributes({ id: 'input__place' });
    addObservers(
      <ObserverComponent> this.inputPlace,
      <ObserverComponent> this.outputPlace
    );
    this.append(this.inputPlace, this.outputPlace);
  }
}
