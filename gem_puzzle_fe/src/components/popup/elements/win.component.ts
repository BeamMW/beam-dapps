import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/tags';
import { Store } from '../../../logic/store/state_handler';
import BaseComponent from '../../base/base.component';

export class Win extends BaseComponent {
  statMove: BaseComponent;

  constructor(data:number, key = PopupKeys.WIN) {
    super(Tags.DIV, [`popup__${key}`]);
    const iconSVG = new BaseComponent(
      Tags.DIV, [`popup__${key}_icon`]
    );
    iconSVG.innerHTML = SVG.popupWon;
    const { grid } = Store.getState();
    const { solution } = grid;
    Store.dispatch(AC.setGame({
      solution: []
    }));
    window.localStorage.setItem('state', JSON.stringify(grid));
    const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
    titleText.element.textContent = 'YOU WON!';
    const amountFunt = new BaseComponent(Tags.DIV, [`popup__${key}_amount`]);
    amountFunt.innerHTML = `${SVG.funt} <span> ??? FUNT </span>`;
    const statWrap = new BaseComponent(Tags.DIV, [`popup__${key}_stat`]);
    this.statMove = new BaseComponent(Tags.SPAN, [`popup__${key}_stat_move`]);
    const statTime = new BaseComponent(Tags.SPAN, [`popup__${key}_stat_move`]);
    this.statMove.innerHTML = `<span>Move:</span> ${solution.length}`;
    statTime.innerHTML = `<span>Time:</span> ${data} MIN`;
    statWrap.append(this.statMove, statTime);
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    this.append(iconSVG, titleText, amountFunt, statWrap, btn);
  }
}
