import { IOutput, IActionParams } from 'beamApiProps';
import { FormDispatch, InformArgs, AddObsever } from 'formProps';
import { Tags } from '../../../../../../../constants/html_elements';
import { FormActions } from '../../../../../../../constants/variables';
import BaseComponent from '../../../../../../BaseComponent/base.component';
import { ParamsLabel } from './params_label.component';

export class Params extends BaseComponent {
  role: string;

  action: string;

  constructor(
    output:IOutput,
    role:string,
    action:string,
    dispatch: FormDispatch,
    observer: (observer: BaseComponent) => void
  ) {
    super(Tags.DIV, ['input__params']);
    observer(this);
    this.role = role;
    this.action = action;
    this.render(output, dispatch, observer);
  }

  informForm = ({
    formAction, currentRole, currentAction, output, dispatch, addObserver
  }:InformArgs):void => {
    if (formAction === FormActions.SET_ROLE
      || formAction === FormActions.SET_ACTION) {
      this.role = currentRole;
      this.action = currentAction;
      this.render(output, dispatch, addObserver);
    }
  };

  render = (
    output:IOutput,
    dispatch:FormDispatch,
    addObserver: AddObsever
  ):void => {
    this.element.innerHTML = '';
    const title = new BaseComponent(Tags.DIV, ['params-title']);
    title.element.innerText = 'Params: ';
    const actions = Object.entries(
      output.roles[this.role]?.[this.action] as IActionParams
    );
    const valuesList = actions.map(
      (el) => new ParamsLabel(el[0], dispatch, addObserver)
    );
    if (valuesList.length) this.append(title, ...valuesList);
  };
}
