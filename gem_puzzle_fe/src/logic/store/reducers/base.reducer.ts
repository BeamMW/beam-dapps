import { PropertiesType } from 'AppStateProps';
import { AC } from '../app_action_creators';

export interface BaseReducer<T> {
  state: T;
  key: string;
  reducer: (obj:ReturnType<PropertiesType<typeof AC>>) => void;
  setState: (newState: Partial<T>) => void;
}
