import { HtmlProps, Tags } from '../../constants/html_tags';
/// import { AppStateHandler } from '../../logic/app_state/state_handler';
import BaseComponent from '../base/base.component';
import { Box } from './box';

export class Cell extends BaseComponent {
  x: number;

  y: number;

  readonly index: number;

  constructor({
    x, y, value, callback
  }:{
    x:number,
    y:number,
    value:number,
    callback: (box: Box, component: Cell) => void
  }) {
    super(Tags.DIV, ['cell']);
    this.x = x;
    this.y = y;
    this.index = value - 1;
    const cellInner = new BaseComponent(Tags.DIV, ['cell-inner']);
    const cellInnerOval = new BaseComponent(Tags.DIV, ['oval']);
    cellInnerOval.innerHTML = `${value}`;
    cellInner.setAttributes({
      'data-number': String(this.index)
    });
    this.rerender({
      x, y, callback
    });
    cellInner.append(cellInnerOval);
    this.append(cellInner);
  }

  rerender = ({ x, y }:{
    x: number,
    y: number,
    callback: (box: Box, component: Cell) => void
  }):void => {
    this.x = x;
    this.y = y;
    this.style.left = `${x * HtmlProps.PuzzleSize}px`;
    this.style.top = `${y * HtmlProps.PuzzleSize}px`;
  };
}
