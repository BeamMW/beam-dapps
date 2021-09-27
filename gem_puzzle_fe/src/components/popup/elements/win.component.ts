import { parseToBeam } from '../../../utils/string_handlers';
import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys } from '../../../constants/app';
import { SVG } from '../../../constants/svg.icons';
import { Tags } from '../../../constants/tags';
import { Store } from '../../../logic/store/state_handler';
import BaseComponent from '../../base/base.component';

export class Win extends BaseComponent {
  statMove: BaseComponent;

  constructor(key = PopupKeys.WIN) {
    super(Tags.DIV, [`popup__${key}`]);
    const iconSVG = new BaseComponent(
      Tags.DIV, [`popup__${key}_icon`]
    );
    iconSVG.innerHTML = SVG.popupWon;
    const prize = Store.getState().cid.prize_amount;
    const { solution } = Store.getState().grid;
    Store.dispatch(AC.setGame({
      solution: []
    }));
    const titleText = new BaseComponent(Tags.SPAN, [`popup__${key}_text`]);
    titleText.element.textContent = 'YOU WON!';
    const amountFunt = new BaseComponent(Tags.DIV, [`popup__${key}_amount`]);
    amountFunt.innerHTML = `${SVG.funt} <span> ${
      Number(parseToBeam(prize)).toFixed(8)
        .replace(/\.?0+$/, '')
    } FUNT </span>`;
    const statWrap = new BaseComponent(Tags.DIV, [`popup__${key}_stat`]);
    this.statMove = new BaseComponent(Tags.SPAN, [`popup__${key}_stat_move`]);
    this.statMove.innerHTML = `<span>Move:</span> ${solution.length}`;
    statWrap.append(this.statMove);
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.element.textContent = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    this.append(iconSVG, titleText, amountFunt, statWrap, btn);
  }
}
