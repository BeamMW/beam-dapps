import { IState } from 'AppStateProps';
import { Routes } from '../../constants/app';
import { SVG } from '../../constants/svg.icons';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import { Store } from '../../logic/store/state_handler';
import './popup.scss';

type PopupType = {
  key: string;
};

export default class Popup extends BaseComponent {
  statMove!: BaseComponent;

  constructor({ key }: PopupType) {
    super(Tags.DIV, [`popup__${key}`]);
    Store.addObservers(this);
    const { solution } = Store.getState().grid;
    if (key === 'won') {
      const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
      iconSVG.innerHTML = SVG.popupWon;
      const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
      titleText.element.textContent = 'YOU WON!';
      const amountFunt = new BaseComponent(Tags.DIV, [`popup__${key}_amount`]);
      amountFunt.innerHTML = `${SVG.funt} <spam> 20 FUNT </span>`;
      const statWrap = new BaseComponent(Tags.DIV, [`popup__${key}_stat`]);
      this.statMove = new BaseComponent(Tags.SPAN, [`popup__${key}_stat_move`]);
      this.statMove.element.innerHTML = `<span>Move:</span> ${solution.length}`;
      statWrap.append(this.statMove);
      const btn = new BaseComponent(Tags.DIV, [`popup__${key}_back`]);
      btn.element.textContent = 'Back to Main Menu';
      btn.element.addEventListener('click', (): void => {
        this.element.classList.remove('active');
      });
      this.append(iconSVG, titleText, amountFunt, statWrap, btn);
    } else if (key === 'lose') {
      const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
      iconSVG.innerHTML = SVG.popupLose;
      const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
      titleText.element.textContent = 'BETTER LUCK NEXT TIME!';
      const btn = new BaseComponent(Tags.DIV, [`popup__${key}_back`]);
      btn.element.textContent = 'Back to Main Menu';
      btn.element.addEventListener('click', (): void => {
        this.element.classList.remove('active');
        window.history.pushState({}, '', `/${Routes.RETURN}`);
      });
      this.append(iconSVG, titleText, btn);
    }
  }

  addActive = (): void => {
    this.classList.add('active');
  };

  appInform = (state: IState): void => {
    const { solution } = state.grid;
    if (solution.length > 0) {
      this.statMove.element.innerHTML = `<span>Move:</span> ${solution.length}`;
    }
  };
}
