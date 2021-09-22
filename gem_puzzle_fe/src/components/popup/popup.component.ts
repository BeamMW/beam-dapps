import { Routes } from '../../constants/app_constants';
import { Tags } from '../../constants/html_tags';
import { SVG } from '../../constants/svg.icons';
import BaseComponent from '../base/base.component';
import './popup.scss';

export default class Popup extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['popup']);
    const icon = new BaseComponent(Tags.DIV, ['popup__icon']);
    icon.innerHTML = SVG.popupWon;
    const text = new BaseComponent(Tags.SPAN, ['popup__text']);
    text.element.textContent = ' YOU WON!';
    const amount = new BaseComponent(Tags.DIV, ['popup__amount']);
    amount.innerHTML = `${SVG.funt} <spam> 20 FUNT </span>`;
    const stat = new BaseComponent(Tags.DIV, ['popup__stat']);
    const statMove = new BaseComponent(Tags.SPAN, ['popup__stat_move']);
    statMove.element.innerHTML = '<span>Move:</span> 56';
    stat.append(statMove);
    const btn = new BaseComponent(Tags.DIV, ['popup__back']);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      this.element.classList.remove('active');
    });
    this.append(icon, text, amount, stat, btn);
  }

  addActive = (): void => {
    this.classList.add('active');
  };
}
