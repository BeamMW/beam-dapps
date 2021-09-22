import { APIResponse, BoardType } from 'beamApiProps';
import { CellToRender } from 'ComponentProps';
import { Cell } from './cell.component';
import { Beam } from '../../logic/beam_api/api_handler';
import {
  RC
} from '../../logic/beam_api/request_creators';
import { HtmlProps, Tags } from '../../constants/html_tags';
import {
  Box, isSolved, solution, swapBoxes
} from './box';
import './field.scss';
import { State } from './state';
import BaseComponent from '../base/base.component';
import NPuzzleSolver from '../../logic/solver/solvers';
import { Store } from '../../logic/app_state/state_handler';
import { ReqID } from '../../constants/api_constants';

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

  timeOutId: NodeJS.Timeout | null;

  constructor() {
    super(Tags.DIV, ['field']);
    Beam.addObservers(this);
    Beam.callApi(RC.viewBoard());
    this.innerField = new BaseComponent(Tags.DIV, ['field-inner']);
    this.timeOutId = null;
    this.solveList = [];
    this.nodeList = [];
    solution.length = 0;
    this.state = null;
    this.element.addEventListener('DOMNodeRemovedFromDocument',
      () => {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
          this.timeOutId = null;
        }
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

  listener = (e: Event):void => {
    if (this.state?.status === 'playing') {
      const target = e.target as HTMLDivElement;
      const inner = target.closest('.cell-inner') as HTMLElement;
      if (inner?.dataset?.number) {
        const number = +inner.dataset.number;
        const { x, y } = this.nodeList[number] as Cell;
        this.handleClickBox(new Box(x, y));
      }
    }
  };

  startGame = (board: BoardType):void => {
    const { autoPlay } = Store.getState();
    this.state = new State(board, 0, 0, 'playing');
    this.init(board);
    if (autoPlay) {
      this.solveList = new NPuzzleSolver(board).solve();
      this.autoPlayHandle();
    } else {
      this.solveList = null;
      this.innerField.element.addEventListener('click',
        this.listener);
    }
  };

  setState = (newState: Partial<State>):void => {
    if (this.state) {
      this.state = { ...this.state, ...newState };
    }
  };

  handleClickBox = (box: Box):void => {
    const { autoPlay } = Store.getState();
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
        this.timeOutId = setTimeout(() => {
          this.removeAll();
          Beam.callApi(RC.checkSolution(solution.join('')));
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
      node.render({
        x, y, callback: this.handleClickBox
      });
    });
  };

  init = (grid: BoardType):void => {
    const status = this.state?.status;
    const len = grid.length;
    this.innerField.style.width = `${HtmlProps.PuzzleSize * len}px`;
    this.innerField.style.height = `${HtmlProps.PuzzleSize * len}px`;
    this.append(this.innerField);
    for (let y = 0; y < len; y++) {
      for (let x = 0; x < len; x++) {
        if (grid[y]?.[x] && status === 'playing') {
          const value = grid[y]?.[x] as number;
          const button = new Cell({
            x,
            y,
            value,
            callback: this.handleClickBox
          });
          this.innerField.append(button);
          this.nodeList.push(button);
        }
      }
    }
    this.nodeList.sort((a, b) => a.index - b.index);
  };

  autoPlayHandle = ():void => {
    if (this.nodeList && this.state?.status === 'playing') {
      this.timeOutId = setTimeout(() => {
        const { piece } = (this.solveList)?.shift() as PuzzleSolveType;
        this.handleClickBox(new Box(piece.x, piece.y));
      }, 160);
    }
  };
}