import { Field } from './field.component';
import { Tags } from '../../constants/tags';
import BaseComponent from '../base/base.component';
import { GameInfo } from '../shared/game_info/game.info.component';
import { gameInfoElements } from '../shared/game_info/game.info.items';
import './game.scss';
import Button from '../shared/button/button.component';
import { MenuBtn, Routes } from '../../constants/app';
import { SVG } from '../../constants/svg.icons';

export class Game extends BaseComponent {
  constructor() {
    super(Tags.DIV, ['game']);
    const gameInfoblock = new BaseComponent(Tags.DIV, ['game-infoblock']);
    const elems = gameInfoElements.map((el) => new GameInfo(el));
    const returnBtn = new Button(
      {
        key: MenuBtn.RETURN,
        title: 'CANCEL GAME',
        icon: SVG.iconCancel,
        handler: ():void => {
          window.history.pushState({}, '', Routes.MAIN);
        }
      }
    );
    gameInfoblock.append(...elems);
    this.append(gameInfoblock, new Field(), returnBtn);
  }
}
