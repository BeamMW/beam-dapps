import { InputPlace } from './InputPlace/input_place.component';
import { Tags } from '../../../constants/html_elements';
import BaseComponent,
{ IObserverComponent } from '../../BaseComponent/base.component';
import { OutputPlace } from './OutputPlace/output_place.component';

export default class Content extends BaseComponent {
  private readonly inputPlace: BaseComponent;

  private readonly outputPlace: BaseComponent;

  constructor(addObservers:(...components: IObserverComponent[]) => void) {
    super(Tags.DIV, ['container__content', 'container']);
    this.inputPlace = new InputPlace();
    this.outputPlace = new OutputPlace();
    this.outputPlace.setAttributes({ id: 'input__place' });
    addObservers(
      <IObserverComponent> this.inputPlace,
      <IObserverComponent> this.outputPlace
    );
    this.append(this.inputPlace, this.outputPlace);
  }
}
