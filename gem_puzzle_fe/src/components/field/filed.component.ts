import { BoardType } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';
import BaseComponent from '../base/base.component';
import './field.scss';

export default class Field extends BaseComponent {
  constructor(board: BoardType) {
    console.log(board);
    super(Tags.DIV, ['field']);
    for (let y = 0; y < board.length; y++) {
      const boardY = board[y] as number[];
      for (let x = 0; x < boardY.length; x++) {
        const block = new BaseComponent(Tags.DIV, [
          'block',
          `block-${boardY[x]}`
        ]);
        block.element.innerHTML = `${boardY[x]}`;
        this.append(block);
      }
    }
  }
}
