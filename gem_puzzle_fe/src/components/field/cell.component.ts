import { HtmlProps, Tags } from '../../constants/html_tags';
/// import { AppStateHandler } from '../../logic/app_state/state_handler';
import BaseComponent from '../base/base.component';
import { Box } from './box';

export class Cell extends BaseComponent {
  x: number;

  y: number;

  sizeX: number;

  sizeY: number;

  readonly index: number;

  constructor({
    x, y, value
  }:{
    x:number,
    y:number,
    value:number,
    callback: (box: Box, component: Cell) => void
  }) {
    super(Tags.DIV, ['cell']);
    this.x = x;
    this.y = y;
    this.sizeY = 0;
    this.sizeX = 0;
    this.index = value - 1;
    const cellInner = new BaseComponent(Tags.DIV, ['cell-inner']);
    const cellInnerOval = new BaseComponent(Tags.DIV, ['oval']);
    cellInnerOval.innerHTML = `${value}`;
    cellInner.setAttributes({
      'data-number': String(this.index)
    });
    // this.render({
    //   x, y, callback
    // });
    cellInner.append(cellInnerOval);
    this.append(cellInner);
  }

  render = ({ x, y }:{
    x: number,
    y: number,
    callback: (box: Box, component: Cell) => void
  }):void => {
    const kX = x > this.x ? 1 : -1;
    const kY = y > this.y ? 1 : -1;
    if (this.x !== x) {
      this.sizeX += (HtmlProps.PuzzleSize * kX);
    }
    if (this.y !== y) {
      this.sizeY += (HtmlProps.PuzzleSize * kY);
    }
    this.style.transform = `translate(${this.sizeX}px, ${this.sizeY}px)`;
    this.x = x;
    this.y = y;
    // this.style.left = `${x * HtmlProps.PuzzleSize}px`;
    // this.style.top = `${y * HtmlProps.PuzzleSize}px`;
    // this.style.transform = `translate(${
    //   this.x !== x
    //     ? x * HtmlProps.PuzzleSize
    //     : 0
    // }px, ${
    //   this.y !== y
    //     ? y * HtmlProps.PuzzleSize
    //     : 0
    // }px )`;
    // this.x = x;
    // this.y = y;
  };
}
