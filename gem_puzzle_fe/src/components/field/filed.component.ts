import { BoardType } from 'beamApiProps';
import { BoardView } from '../../constants/app_constants';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { Tags } from '../../constants/html_tags';
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
import NPuzzleSolver from '../../logic/solver/solvers';

export class Field {
  static tickId: any;

  state?: any;

  tickId: any;

  menu: Menu;

  solveList: any [] | null;

  timeOutId: null | NodeJS.Timeout;

  constructor(state: any, solveList?: any[]) {
    this.state = state;
    this.tickId = null;
    this.timeOutId = null;
    if (solveList) {
      this.solveList = solveList;
    } else this.solveList = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);
    this.menu = new Menu();
  }

  static ready = (board: BoardType): Field => {
    const { autoPlay } = AppStateHandler.getState();
    const solveBoard = new NPuzzleSolver(board).solve() as any [];
    if (autoPlay) { return new Field(State.start(board), solveBoard); }
    return new Field(State.start(board));
  };

  tick = (): void => {
    this.setState({ time: this.state.time + 1 });
  };

  setState = (newState: any):void => {
    this.state = { ...this.state, ...newState };
    this.render();
  };

  handleClickBox = (box: Box):void => {
    const nextdoorBoxes = box.getNextdoorBoxes();
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

  render = (): void => {
    const {
      grid, status
    } = this.state;
    // Render grid
    const main = document.querySelector('.main');
    const newGrid = new BaseComponent(Tags.DIV, ['field']);
    const { picOpt, autoPlay } = AppStateHandler.getState();
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
        button.classList.add('button');
        if (status === 'playing' && !autoPlay) {
          button.element.addEventListener(
            'click',
            () => this.handleClickBox(new Box(j, i))
          );
        }
        button.element.classList.add(grid[i][j] === 0 ? 'empty' : 'button');
        newGrid.element.append(button.element);
      }
    }
    (document.querySelector('.field') as HTMLElement).replaceWith(
      newGrid.element
    );
    if (autoPlay && status === 'playing') {
      const { piece } = this.solveList?.shift();
      this.timeOutId = setTimeout(() => {
        this.handleClickBox(new Box(piece.x, piece.y));
      }, 150);
    }

    newGrid.element.addEventListener('DOMNodeRemovedFromDocument', () => {
      clearTimeout(this.timeOutId as NodeJS.Timeout);
    });
    // Render button
    if (status === 'won') {
      setTimeout(() => {
        main?.removeChild(newGrid.element);
        console.log(solution.join(''));
        checkSolution(solution.join(''));
        solution.length = 0;
      }, 2000);
    }
    // // Render move
    // (
    //   document.getElementById('move') as HTMLElement
    // ).textContent = `Move: ${move}`;
    // // Render time
    // (
    //   document.getElementById('time') as HTMLElement
    // ).textContent = `Time: ${time}`;
    // // Render message

    if (status === 'won') {
      (document.querySelector('.message') as HTMLElement)
        .textContent = 'You win!';
    } else {
      // (document.querySelector('.message') as HTMLElement).textContent = '';
    }
  };
}
