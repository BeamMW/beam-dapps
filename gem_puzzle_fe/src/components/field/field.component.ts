import { APIResponse, BoardLengthType, BoardType } from 'beamApiProps';
import { CellToRender } from 'ComponentProps';
import { Cell } from './cell.component';
import { ApiHandler } from '../../logic/beam_api/api_handler';
import {
  viewBoard,
  checkSolution
} from '../../logic/beam_api/request_creators';
import { HtmlProps, Tags } from '../../constants/html_tags';
import {
  Box, isSolved, solution, swapBoxes
} from './box';
import './field.scss';
import { State } from './state';
import BaseComponent from '../base/base.component';
import NPuzzleSolver from '../../logic/solver/solvers';
import { AppStateHandler } from '../../logic/app_state/state_handler';
import { ReqID } from '../../constants/api_constants';
import { setModeAC } from '../../logic/app_state/app_action_creators';

type PuzzleSolveType = {
  piece: {
    x: number;
    y: number;
  }
  empty: {
    x:number,
    y:number
  },
  number: number;
};

export class Field extends BaseComponent {
  private state: State | null;

  private solveList: PuzzleSolveType [] | null;

  private readonly nodeList: Cell[];

  private readonly innerField: BaseComponent;

  private timeOutId: NodeJS.Timeout | null;

  constructor() {
    super(Tags.DIV, ['field']);
    ApiHandler.addObservers(this);
    this.innerField = new BaseComponent(Tags.DIV, ['field-inner']);
    this.timeOutId = null;
    this.solveList = [];
    this.nodeList = [];
    this.state = null;
    viewBoard();
    this.element.addEventListener('DOMNodeRemovedFromDocument', () => {
      clearTimeout(this.timeOutId as NodeJS.Timeout);
      this.solveList = null;
    });
  }

  inform = (res: APIResponse):void => {
    switch (res.id) {
      case ReqID.VIEW_BOARD:
        this.startGame(JSON.parse(res.result.output).board as BoardType);
        break;
      default:
        break;
    }
  };

  startGame = (board: BoardType):void => {
    const { autoPlay, mode } = AppStateHandler.getState();
    if (mode !== board.length) {
      AppStateHandler.dispatch(setModeAC(board.length as BoardLengthType));
    }
    this.state = new State(board, 0, 0, 'playing');

    this.init(board);
    this.innerField.append(...this.nodeList as BaseComponent[]);
    if (autoPlay) {
      this.solveList = new NPuzzleSolver(board).solve();
      this.autoPlayHandle();
    } else this.solveList = null;
  };

  setState = (newState: Partial<State>):void => {
    if (this.state) {
      this.state = { ...this.state, ...newState };
    }
  };

  handleClickBox = (box: Box):void => {
    const { autoPlay } = AppStateHandler.getState();
    const nextdoorBoxes = box.getNextdoorBoxes();
    const blankBox = nextdoorBoxes.find(
      (nextdoorBox) => this.state?.grid[nextdoorBox.y]?.[nextdoorBox.x] === 0
    );
    if (blankBox && this.state) {
      const newGrid = [...this.state.grid];
      const swapped = swapBoxes(newGrid, { x: box.x, y: box.y }, blankBox);
      if (isSolved(newGrid) && this.state.status === 'playing') {
        this.setState({
          status: 'won',
          grid: newGrid,
          move: this.state.move + 1
        });
        this.timeOutId = null;
        setTimeout(() => {
          this.removeAll();
          checkSolution(solution.join(''));
          solution.length = 0;
        }, 3000);
      } else {
        this.setState({
          grid: newGrid,
          move: this.state.move + 1
        });
      }
      this.rerender(swapped);
      if (this.state?.status === 'playing' && autoPlay) {
        this.autoPlayHandle();
      }
    }
  };

  rerender = (swapped: CellToRender[]):void => {
    swapped.forEach(({ index, x, y }) => {
      const node = this.nodeList[index] as Cell;
      node.rerender({
        x, y, callback: this.handleClickBox
      });
    });
  };

  init = (grid: BoardType):void => {
    const { mode } = AppStateHandler.getState();
    const status = this.state?.status;
    this.innerField.style.width = `${HtmlProps.PuzzleSize * mode}px`;
    this.innerField.style.height = `${HtmlProps.PuzzleSize * mode}px`;
    this.append(this.innerField);
    for (let y = 0; y < mode; y++) {
      for (let x = 0; x < mode; x++) {
        if (grid[y]?.[x] && status === 'playing') {
          const value = grid[y]?.[x] as number;
          const button = new Cell({
            x,
            y,
            value,
            callback: this.handleClickBox
          });
          this.nodeList.push(button);
        }
      }
    }
    this.nodeList.sort((a, b) => {
      const aNum = Number(a.dataset.number as string);
      const bNum = Number(b.dataset.number as string);
      return aNum - bNum;
    });
  };

  autoPlayHandle = ():void => {
    if (this.nodeList && this.state?.status === 'playing') {
      this.timeOutId = setTimeout(() => {
        const { piece } = (this.solveList)?.shift() as PuzzleSolveType;
        this.handleClickBox(new Box(piece.x, piece.y));
      }, 120);
    }
  };
}
