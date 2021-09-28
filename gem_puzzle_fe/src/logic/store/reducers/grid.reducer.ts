import { PropertiesType } from 'beamApiProps';
import { BoardType, IGridState } from 'AppStateProps';
import { BaseReducer } from './base.reducer';
import { AC } from '../app_action_creators';
import { GridActions } from '../../../constants/app';

const initialState:IGridState = {
  board: null,
  solution: [],
  status: 'ready',
  permutation: null
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
      case GridActions.SET_GAME:
        if (typeof payload === 'object') {
          if ((payload as IGridState).board) {
            this.state.board = ((payload as IGridState)
              .board as BoardType).map((y:number[]) => y.map((x) => x));
          } else if ((payload as IGridState)
            .board === null) this.state.board = null;
          if ((payload as IGridState).status) {
            this.state.status = (
              payload as IGridState
            ).status;
          }
          if ((payload as IGridState).solution) {
            if ((payload as IGridState).solution?.length) {
              this.state.solution = [
                ...this.state.solution,
                ...(payload as IGridState)
                  .solution
              ];
            } else this.state.solution.length = 0;
          }
          if ((payload as IGridState).permutation) {
            this.state.permutation = (payload as IGridState)
              .permutation;
          } else if ((payload as IGridState).permutation === null) {
            this.state.permutation = null;
          }
          localStorage.setItem('state', JSON.stringify(this.state));
        }
        break;
      default:
        break;
    }
  };
}
