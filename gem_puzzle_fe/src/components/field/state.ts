import { BoardType } from 'beamApiProps';

type BoardCoords = { x: number, y: number };

export class State {
  grid: BoardType;

  empty: BoardCoords;

  move: number;

  time: number;

  status: 'ready' | 'playing' | 'won';

  constructor(
    grid: BoardType,
    move: number,
    time: number,
    status: 'ready' | 'playing' | 'won'
  ) {
    this.grid = grid;
    this.empty = { x: this.grid.length - 1, y: this.grid.length - 1 };
    this.move = move;
    this.time = time;
    this.status = status;
  }

  // static ready(board: BoardType):State {
  //   return new State(board, 0, 0, 'ready');
  // }

  // static start = (board: BoardType):State => new State(board, 0, 0, 'playing');
}
