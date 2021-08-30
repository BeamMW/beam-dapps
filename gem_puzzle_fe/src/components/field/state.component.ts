import { BoardType } from 'beamApiProps';

export class State {
  grid: any;

  move: any;

  time: any;

  status: any;

  constructor(grid: any, move: any, time: any, status: any) {
    this.grid = grid;
    this.move = move;
    this.time = time;
    this.status = status;
  }

  static ready(board: any):State {
    return new State(board, 0, 0, 'ready');
  }

  static start = (
    board: BoardType | undefined
  ):State => new State(board, 0, 0, 'playing');
}
