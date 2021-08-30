// import { BoardType } from 'beamApiProps';
import { BoardType } from 'beamApiProps';
import { Tags } from '../../constants/html_tags';
import { Box, isSolved, swapBoxes } from './box.component';
// import BaseComponent from '../base/base.component';
// import Main from '../../components/main/main.component'
import './field.scss';
import { State } from './state.component';

// function getRandomGrid():any{
//   let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

//   // Shuffle
//   let blankBox: Box | null | undefined = new Box(3, 3);
//   for (let i = 0; i < 1000; i++) {
//     const randomNextdoorBox:any = blankBox?.getRandomNextdoorBox();
//     swapBoxes(grid, blankBox, randomNextdoorBox);
//     blankBox = randomNextdoorBox;
//   }

//   if (isSolved(grid)) return getRandomGrid();
//   console.log(grid)
//   return grid;
// };

export class Field {
  static tickId: any;

  [x: string]: any;

  state: any;

  tickId: any;

  constructor(state: any) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);
  }

  static ready = (board: BoardType):Field => new Field(State.start(board));

  tick = ():void => {
    this.setState({ time: this.state.time + 1 });
  };

  setState = (newState: any):void => {
    this.state = { ...this.state, ...newState };
    this.render();
  };

  handleClickBox(box: { getNextdoorBoxes: () => any }) {
    return () => {
      const nextdoorBoxes = box.getNextdoorBoxes();
      console.log(nextdoorBoxes);

      const blankBox = nextdoorBoxes.find(
        (nextdoorBox: {
          y: string | number; x: string | number
        }) => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
      );
      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, box, blankBox);
        if (isSolved(newGrid)) {
          clearInterval(Field.tickId);
          this.setState({
            status: 'won',
            grid: newGrid,
            move: this.state.move + 1
          });
        } else {
          this.setState({
            grid: newGrid,
            move: this.state.move + 1
          });
        }
      }
    };
  }

  render = ():void => {
    const {
      grid, move, time, status
    } = this.state;

    // Render grid
    const main = document.querySelector('.main');
    const newGrid: any = document.createElement(Tags.DIV);
    newGrid.classList.add('field');
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const button = document.createElement(Tags.BUTTON);
        main?.append(newGrid);
        button.classList.add('button');
        if (status === 'playing') {
          button.addEventListener('click', this.handleClickBox(new Box(j, i)));
        }

        button.textContent = grid[i][j] === 0 ? '' : grid[i][j].toString();
        // console.log(newGrid)
        // console.log(this.main)
        newGrid.appendChild(button);
      }
    }
    (document.querySelector('.field') as HTMLElement).replaceWith(newGrid);

    // Render button
    const newButton: any = document.createElement(Tags.BUTTON);
    if (status === 'ready') newButton.textContent = 'Play';
    if (status === 'playing') newButton.textContent = 'Reset';
    if (status === 'won') alert('YOU WIN');
    newButton.addEventListener('click', () => {
      clearInterval(Field.tickId);
      Field.tickId = setInterval(this.tick, 1000);
      this.setState(State.start(this.board));
    });
    (document.querySelector('.footer button') as HTMLElement)
      .replaceWith(newButton);
    // Render move
    (document.getElementById('move') as HTMLElement)
      .textContent = `Move: ${move}`;
    // Render time
    (document.getElementById('time') as HTMLElement)
      .textContent = `Time: ${time}`;
    // Render message

    if (status === 'won') {
      (document.querySelector('.message') as HTMLElement)
        .textContent = 'You win!';
    } else {
      (document.querySelector('.message') as HTMLElement)
        .textContent = '';
    }
  };
}
