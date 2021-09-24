import { BoardType } from 'beamApiProps';
import { CellToRender } from 'ComponentProps';
import { IState } from 'AppStateProps';
import { AC } from '../../logic/store/app_action_creators';
import { Cell } from './cell.component';
import { Beam } from '../../logic/beam/api_handler';
import {
  RC
} from '../../logic/beam/request_creators';
import { HtmlProps, Tags } from '../../constants/tags';
import {
  Box, isSolved, swapBoxes
} from './box';
import './field.scss';
import BaseComponent from '../base/base.component';
import NPuzzleSolver from '../../logic/solver/solvers';
import { Store } from '../../logic/store/state_handler';

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
  private solveList: PuzzleSolveType [] | null;

  private readonly nodeList: Cell[];

  private readonly innerField: BaseComponent;

  timeOutId: NodeJS.Timeout | null;

  constructor() {
    super(Tags.DIV, ['field']);
    Beam.addObservers(this);
    Store.addObservers(this);
    const { board } = Store.getState().grid;
    this.innerField = new BaseComponent(Tags.DIV, ['field-inner']);
    this.timeOutId = null;
    this.solveList = [];
    this.nodeList = [];
    this.element.addEventListener('DOMNodeRemovedFromDocument',
      () => {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
          this.timeOutId = null;
        }
      });
    if (board) this.startGame(board);
    else this.rebootHandler();
  }

  rebootHandler = ():void => {
    const state = window.localStorage.getItem('state');
    if (state) {
      const parsed = JSON.parse(state) as {
        board: BoardType | null,
        solution: ('u' | 'd' | 'r' | 'l')[],
        permutation: number | null
      };
      if (parsed.board && parsed.permutation) {
        Store.dispatch(AC.setGame({
          ...parsed,
          status: 'ready'
        }));
      } else {
        Beam.callApi(RC.viewBoard());
      }
    } else {
      Beam.callApi(RC.viewBoard());
    }
  };

  appInform = (store: IState):void => {
    const {
      status, solution, board, permutation
    } = store.grid;
    const { autoPlay } = store.info;

    if (status === 'playing' && autoPlay) {
      this.autoPlayHandle();
    }

    if (status === 'ready') {
      if (board) {
        this.startGame(board);
      } else {
        Beam.callApi(RC.viewBoard());
      }
    }

    if (status === 'won' && board) {
      console.log(status);
      Store.dispatch(AC.setGame({
        status: 'won',
        board: null,
        solution: [],
        permutation: null
      }));
      this.timeOutId = setTimeout(() => {
        this.removeAll();
        Beam.callApi(RC.checkSolution(solution.join(''), <number>permutation));
        solution.length = 0;
      }, 3000);
    }
  };

  listener = (e: Event):void => {
    const { status } = Store.getState().grid;
    if (status === 'playing') {
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
    const { autoPlay } = Store.getState().info;
    Store.dispatch(AC.setGame(
      {
        status: 'playing'
      }
    ));
    this.init(board);
    if (autoPlay) {
      this.solveList = new NPuzzleSolver(board).solve();
    } else {
      this.solveList = null;
      this.innerField.element.addEventListener('click',
        this.listener);
    }
  };

  handleClickBox = (box: Box):void => {
    const { board, status } = Store.getState().grid;
    const nextdoorBoxes = box.getNextdoorBoxes();
    const blankBox = nextdoorBoxes.find(
      (nextdoorBox) => board?.[nextdoorBox.y]?.[nextdoorBox.x] === 0
    );
    if (blankBox && board) {
      const newGrid: BoardType = board.map((y) => y.map((x) => x));
      const swapped = swapBoxes(newGrid, { x: box.x, y: box.y }, blankBox);
      if (isSolved(newGrid) && status === 'playing') {
        Store.dispatch(AC.setGame({
          status: 'won',
          board: newGrid,
          solution: swapped.map((move) => move.solution)
        }));
      } else {
        Store.dispatch(AC.setGame({
          board: newGrid,
          solution: swapped.map((move) => move.solution)
        }));
      }
      this.rerender(swapped);
    }
  };

  rerender = (swapped: CellToRender[]):void => {
    swapped.forEach(({ index, x, y }) => {
      const node = this.nodeList[index] as Cell;
      node.render({ x, y });
    });
  };

  init = (board: BoardType):void => {
    const { status } = Store.getState().grid;
    const len = board.length;
    this.innerField.style.width = `${HtmlProps.PuzzleSize * len}px`;
    this.innerField.style.height = `${HtmlProps.PuzzleSize * len}px`;
    this.append(this.innerField);
    for (let y = 0; y < len; y++) {
      for (let x = 0; x < len; x++) {
        if (board[y]?.[x] && status === 'playing') {
          const value = board[y]?.[x] as number;
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
    if (this.nodeList) {
      this.timeOutId = setTimeout(() => {
        const { piece } = (this.solveList)?.shift() as PuzzleSolveType;
        this.handleClickBox(new Box(piece.x, piece.y));
      }, 160);
    }
  };
}
