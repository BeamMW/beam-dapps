import { IState } from 'AppStateProps';
import { GameInfoCb, GameInfoParams } from 'ComponentProps';
import moves from '../../../assets/icon/icon-moves.svg';
import { AppSpecs } from '../../../constants/api';

export const gameInfoElements:GameInfoParams[] = [
  {
    title: 'Moves: ',
    icon: moves,
    callback: (state: IState):GameInfoCb => {
      const { solution } = state.grid;
      const value = AppSpecs.MAX_MOVES - solution.length;
      const color = value < (AppSpecs.MAX_MOVES / 2)
      && value >= (AppSpecs.MAX_MOVES / 4)
        ? 'rgba(247, 202, 24, 0.3)'
        : value < (AppSpecs.MAX_MOVES / 4)
          ? 'rgba(240, 52, 52, 0.3)'
          : '';
      return {
        value: String(value), result: value > 0, color
      };
    }
  }
];
