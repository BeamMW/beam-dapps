import { BoardType, PropertiesType } from 'beamApiProps';
import { IGridState } from 'AppStateProps';
import { BaseReducer } from './base.reducer';
import { AC } from '../app_action_creators';
import { GridActions } from '../../../constants/app';

const initialState:IGridState = {
  board: null,
  solution: [],
  time: 0,
  status: 'ready'
};

export class GridState implements BaseReducer<IGridState> {
  state: IGridState = initialState;

  key = 'grid';

  setState = (newState: Partial<IGridState>): void => {
    this.state = { ...this.state, ...newState };
  };

  reducer = ({ action, payload }:ReturnType<
  PropertiesType<typeof AC>
  >):void => {
    switch (action) {
      case GridActions.SET_GRID:
        this.state.board = (payload as BoardType)
          .map((y:number[]) => y.map((x) => x));
        break;
      case GridActions.SET_SOLUTION:
        this.state.solution = [
          ...this.state.solution, ...payload as ('u' | 'd' | 'r' | 'l')[]
        ];
        break;
      case GridActions.SET_STATUS:
        this.state.status = payload as 'ready' | 'playing' | 'won';
        break;
      case GridActions.SET_GAME:
        this.state.board = (payload as Omit<IGridState, 'time'>).board;
        this.state.status = (payload as Omit<IGridState, 'time'>).status;
        if ((payload as Omit<IGridState, 'time'>).solution.length) {
          this.state.solution = [
            ...this.state.solution,
            ...(payload as Omit<IGridState, 'time'>).solution
          ];
        } else this.state.solution.length = 0;
        break;
      default:
        break;
    }
  };
}
