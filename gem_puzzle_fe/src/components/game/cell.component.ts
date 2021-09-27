import { HtmlProps, Tags } from '../../constants/tags';
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
    this.sizeY = HtmlProps.PuzzleSize * y;
    this.sizeX = HtmlProps.PuzzleSize * x;
    this.index = value - 1;
    const cellInner = new BaseComponent(Tags.DIV, ['cell-inner']);
    // const cellInnerOval = new BaseComponent(Tags.DIV, ['oval']);
    cellInner.innerHTML = `${value}`;
    cellInner.setAttributes({
      'data-number': String(this.index)
    });

    // cellInner.append(cellInnerOval);
    this.append(cellInner);
    this.render({ x, y });
  }

  render = ({ x, y }:{
    x: number,
    y: number
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
  };
}
