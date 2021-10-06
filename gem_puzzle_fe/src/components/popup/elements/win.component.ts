import { parseToBeam } from '../../../utils/string_handlers';
import { AC } from '../../../logic/store/app_action_creators';
import { PopupKeys } from '../../../constants/app';
import { Tags } from '../../../constants/html';
import { Store } from '../../../logic/store/state_handler';
import BaseComponent from '../../base/base.component';
import winPic from '../../../assets/icon/il-giveaway-started.svg';
import gemPic from '../../../assets/icon/icon-funts-coins-stack.svg';

export class Win extends BaseComponent {
  statMove: BaseComponent;

  constructor(key = PopupKeys.WIN) {
    super(Tags.DIV, [`popup__${key}`]);
    const content = new BaseComponent(Tags.DIV, ['popup-content']);
    const iconSVG = new BaseComponent(
      Tags.IMG, [`popup__${key}_icon`, 'popup-icon']
    );
    iconSVG.setAttributes({
      src: winPic
    });
    const prize = Store.getState().cid.prize_amount;
    const { solution } = Store.getState().grid;
    const { asset } = Store.getState().info;
    Store.dispatch(AC.setGame({
      solution: []
    }));
    const titleText = new BaseComponent(
      Tags.DIV, [`popup__${key}_text`, 'popup-title']
    );
    titleText.innerHTML = 'YOU WON!';
    const amountFunt = new BaseComponent(Tags.DIV, [`popup__${key}_amount`]);
    const pic = new BaseComponent(Tags.IMG);
    pic.setAttributes({
      src: gemPic
    });
    const prizeNumber = new BaseComponent(Tags.SPAN);
    prizeNumber.innerHTML = `${
      Number(parseToBeam(prize)).toFixed(8)
        .replace(/\.?0+$/, '')
    } ${asset.name}`;
    amountFunt.append(pic, prizeNumber);
    const statWrap = new BaseComponent(Tags.DIV, [`popup__${key}_stat`]);
    this.statMove = new BaseComponent(Tags.SPAN, [`popup__${key}_stat_move`]);
    this.statMove.innerHTML = `<span>Move:</span> ${solution.length}`;
    statWrap.append(this.statMove);
    const btnBlock = new BaseComponent(Tags.DIV, ['popup-btn_block']);
    const btn = new BaseComponent(Tags.DIV, ['back-to-main']);
    btn.innerHTML = 'Back to Main Menu';
    btn.element.addEventListener('click', (): void => {
      Store.dispatch(AC.setPopup(false));
    });
    btnBlock.append(btn);
    content.append(iconSVG, titleText, amountFunt, statWrap);
    this.append(content, btnBlock);
  }
}
