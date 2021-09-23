import { SVG } from '../../constants/svg.icons';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';

type PopupType = {
  key: string;
};

export default class PopupProp extends BaseComponent {
  constructor({ key }: PopupType) {
    super(Tags.DIV, [`popup__${key}`]);
    if (key === 'won') {
      const iconSVG = new BaseComponent(Tags.DIV, [`popup__${key}_icon`]);
      iconSVG.innerHTML = SVG.popupWon;
      const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
      titleText.element.textContent = 'YOU WON!';
      const amountFunt = new BaseComponent(Tags.DIV, [`popup__${key}_amount`]);
      amountFunt.innerHTML = `${SVG.funt} <spam> 20 FUNT </span>`;
      const statWrap = new BaseComponent(Tags.DIV, [`popup__${key}_stat`]);
      const statMove = new BaseComponent(Tags.SPAN, [
        `popup__${key}_stat_move`
      ]);
      statMove.element.innerHTML = '<span>Move:</span> 56';
      statWrap.append(statMove);
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
      titleText.element.textContent = 'Better luck next time!';
      const btn = new BaseComponent(Tags.DIV, [`popup__${key}_back`]);
      btn.element.textContent = 'Back to Main Menu';
      btn.element.addEventListener('click', (): void => {
        this.element.classList.remove('active');
      });
      this.append(iconSVG, titleText, btn);
    }
  }
  // super(Tags.DIV, ['popup__lose']);
  //     const iconSVG = new BaseComponent(Tags.DIV, ['popup__lose_icon']);
  //     iconSVG.innerHTML = icon;
  //     const titleText = new BaseComponent(Tags.SPAN, ['popup__lose_text']);
  //     titleText.element.textContent = text;
  //     const amountFunt = new BaseComponent(Tags.DIV, ['popup__lose_amount']);
  //     amountFunt.innerHTML = `${SVG.funt} <spam> 20 FUNT </span>`;
  //     const statWrap = new BaseComponent(Tags.DIV, ['popup__lose_stat']);
  //     const statMove = new BaseComponent(Tags.SPAN, ['popup__lose_stat_move']);
  //     statMove.element.innerHTML = '<span>Move:</span> 56';
  //     statWrap.append(statMove);
  //     const btn = new BaseComponent(Tags.DIV, ['popup__lose_back']);
  //     btn.element.textContent = 'Back to Main Menu';
  //     btn.element.addEventListener('click', (): void => {
  //       this.element.classList.remove('active');
  //     });
  //     this.append(iconSVG, titleText, amountFunt, statWrap, btn);
  //   }
}
