import { HtmlProps, Tags } from '../../constants/html_tags';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import BaseComponent from '../base/base.component';
import { Box } from './box';

export class Cell extends BaseComponent {
  constructor({
    x, y, value, callback
  }:{
    x:number,
    y:number,
    value:number,
    callback: (box: Box, component: Cell) => void
  }) {
    super(Tags.DIV, ['cell']);
    const { autoPlay } = AppStateHandler.getState();
    const cellInner = new BaseComponent(Tags.DIV, ['cell-inner']);
    const cellInnerOval = new BaseComponent(Tags.DIV, ['oval']);
    cellInnerOval.innerHTML = `${value}`;
    this.setAttributes({
      'data-number': String(value)
    });
    this.style.left = `${x * HtmlProps.PuzzleSize}px`;
    this.style.top = `${y * HtmlProps.PuzzleSize}px`;
    if (!autoPlay) {
      this.element.addEventListener(
        'click',
        () => callback(new Box(x, y), this),
        { once: true }
      );
    }
    cellInner.append(cellInnerOval);
    this.append(cellInner);
  }

  rerender = ({ x, y, callback }:{
    x: number,
    y: number,
    callback: (box: Box, component: Cell) => void
  }):void => {
    const { autoPlay } = AppStateHandler.getState();
    this.style.left = `${x * HtmlProps.PuzzleSize}px`;
    this.style.top = `${y * HtmlProps.PuzzleSize}px`;
    if (!autoPlay) {
      this.element.addEventListener(
        'click',
        () => callback(new Box(x, y), this),
        { once: true }
      );
    }
  };
}
