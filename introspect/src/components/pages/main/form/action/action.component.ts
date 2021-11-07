import { IActionParams } from 'beamApiProps';
import { AC } from '../../../../../logic/store/action-creators';
import { RC } from '../../../../../logic/beam/request-creators';
import { Tags } from '../../../../../constants/html_elements';
import { toDOMParser } from '../../../../../utils/string-handlers';
import ActionLogic from '../../../../../logic/actions/actions.logic';
import OutputPlace from '../output/output-place.component';
import Params from '../params/params-value.component';
import { BEAM, STORE } from '../../../../../controllers';
import { actionColorsData, buttonsData, svgData } from '../../../../../data';
import { BaseComponent, Button, ParamsInput } from '../../../../shared';
import './action.scss';

class Action extends BaseComponent {
  private readonly activeListeners: Button[] = [];

  private params: ActionLogic;

  constructor([action, params]: [string, IActionParams], index: number) {
    super(Tags.DIV, ['method__label', `action-${action}`]);
    this.params = new ActionLogic([STORE.getState().role, action, params]);
    const title = this.createTitleBlock([action, params]);
    const component = this.createActionBlock([action, params]);

    this.style.background = this.actionColor(index);

    this.element.addEventListener(
      'click', (e: Event) => this.actionMenuHandler(e, component)
    );

    this.append(title, component);
  }

  private readonly subscribe = (component: ParamsInput): void => {
    this.params.subscribe(component);
    const listener = this.params.subscribeListener(
      component,
      this.setActiveButton
    );
    component.element.addEventListener('input', listener);
    component.listener = listener;
  };

  actionColor = (index: number): string => (
    index < actionColorsData.length
      ? <string>actionColorsData[index]
      : <string>(
          actionColorsData[
            (index - actionColorsData.length)
              / Math.floor(index / actionColorsData.length)
          ]
        ));

  submitHandler = (action: string): void => {
    BEAM.callApi(RC.submitResult(action, this.params.getArgs()));
    STORE.dispatch(AC.setOnload(action));
  };

  actionMenuHandler = (
    e: Event,
    component: BaseComponent
  ): void => {
    const target = e.target as HTMLElement;
    if (target.closest('.method__label-title')) {
      this.classList.toggle('active');
      if (component.style.maxHeight) {
        component.style.maxHeight = '';
      } else {
        component.style.maxHeight = `${component.element.scrollHeight + 20}px`;
      }
    }
  };

  setActiveButton = (isActive: boolean): void => {
    this.activeListeners.forEach((button) => {
      if (isActive) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  };

  createTitleBlock = ([action]: [
    string,
    IActionParams
  ]): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['method__label-title']);
    const span = new BaseComponent(Tags.SPAN);
    const arrowDown = new BaseComponent(Tags.DIV, ['arrowDown']);
    span.textContent = action;
    arrowDown.append(toDOMParser(svgData.iconArrowDown));
    component.append(span, arrowDown);
    return component;
  };

  createActionBlock = ([action, params]: [
    string,
    IActionParams
  ]): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['action__place']);
    const inner = this.createRequestBlock([action, params]);
    component.append(inner, new OutputPlace(action, this.subscribe));
    return component;
  };

  createRequestBlock = ([key, value]: [
    string,
    IActionParams
  ]): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['action__request']);
    const params = Object.keys(value);
    component.style.paddingTop = params.length ? '34px' : '62px';
    component.append(
      new Params(value, this.subscribe),
      this.createButtonsBlock(key, params)
    );
    return component;
  };

  createButtonsBlock = (
    action: string,
    keys: string[]
  ): BaseComponent => {
    const component = new BaseComponent(Tags.DIV, ['buttons']);
    const [clear, submit] = buttonsData.map(
      (btn) => new Button({
        ...btn,
        action
      })
    );
    clear?.addEventListener('click',
      () => this.params.clearParamsHandler(keys, this.setActiveButton));
    submit?.addEventListener('click', () => this.submitHandler(action));
    this.activeListeners.push(clear as Button);
    if (clear && submit) component.append(clear, submit);
    return component;
  };
}

export default Action;
