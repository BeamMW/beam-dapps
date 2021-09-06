import { BoardType } from 'beamApiProps';
import { BoardView } from '../../constants/app_constants';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import {
  Box, isSolved, solution, swapBoxes
} from './box';
import './field.scss';
import { State } from './state';
import { checkSolution } from '../../logic/beam_api/request_creators';
import Menu from '../menu/menu.component';
import BaseComponent from '../base/base.component';
import { boxPozition } from '../../utils/string_handlers';
import img from '../../assets/pic320.jpg';

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

  state?: any;

  tickId: any;

  menu: Menu;

  constructor(state: any) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);
    ApiHandler.addObservers(this);
    this.menu = new Menu();
  }

  static ready = (board: BoardType): Field => new Field(State.start(board));

  tick = (): void => {
    this.setState({ time: this.state.time + 1 });
  };

  setState = (newState: any):void => {
    this.state = { ...this.state, ...newState };
    this.render();
  };

  handleClickBox(box: { getNextdoorBoxes: () => any; x: number; y: number }) {
    return ():void => {
      const nextdoorBoxes = box.getNextdoorBoxes();
      console.log(nextdoorBoxes);

      const blankBox = nextdoorBoxes.find(
        (nextdoorBox: {
          y: number; x: number
        }) => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
      );
      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, { x: box.x, y: box.y }, blankBox);
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
  //  inform = (res:APIResponse):void => {
  //     if (res.id === ReqID.CHECK) {
  //       console.log("WIN")
  //     }
  //   };

  render = (): void => {
    const {
      grid, move, time, status
    } = this.state;
    // Render grid
    const main = document.querySelector('.main');
    const newGrid = new BaseComponent(Tags.DIV, ['field']);
    // newGrid.classList.add('field');
    const { picOpt } = AppStateHandler.getState();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const button = new BaseComponent(Tags.BUTTON, ['button']);
        if (picOpt === BoardView.PICTURE) {
          const position = boxPozition(grid[i][j]);
          if (position) {
            button.style.backgroundImage = `url(${img})`;
            button.style.backgroundPosition = `
            ${position.x * 80 * -1}px ${position.y * 80 * -1}px`;
          }
        } else {
          button.element.textContent = grid[i][j] === 0
            ? ''
            : grid[i][j].toString();
        }
        main?.append(newGrid.element);
        // button.classList.add('button');
        if (status === 'playing') {
          button.element.addEventListener(
            'click',
            this.handleClickBox(new Box(j, i))
          );
        }
        button.element.classList.add(grid[i][j] === 0 ? 'empty' : 'button');

        // console.log(newGrid)
        // console.log(this.main)
        newGrid.element.append(button.element);
      }
    }
    (document.querySelector('.field') as HTMLElement).replaceWith(
      newGrid.element
    );

    // Render button
    // const setTimer =()=>{
    //   clearInterval(Field.tickId);
    //   Field.tickId = setInterval(this.tick, 1000);
    //   this.setState(State.start(this.board));
    // };
    if (status === 'ready') console.log('ready');

    if (status === 'playing') console.log(newGrid.element);
    if (status === 'won') {
      console.log('won');
      main?.removeChild(newGrid.element);
      console.log(solution.join(''));
      checkSolution(solution.join(''));
    }
    // Render move
    (
      document.getElementById('move') as HTMLElement
    ).textContent = `Move: ${move}`;
    // Render time
    (
      document.getElementById('time') as HTMLElement
    ).textContent = `Time: ${time}`;
    // Render message

    if (status === 'won') {
      (document.querySelector('.message') as HTMLElement)
        .textContent = 'You win!';
    } else {
      (document.querySelector('.message') as HTMLElement).textContent = '';
    }
  };
}
