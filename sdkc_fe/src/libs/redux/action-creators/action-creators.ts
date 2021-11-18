import { PropertiesType } from '@types';
import { ACTIONS } from '../constants';

const AC = {
  setCID: (payload: string) => ({
    type: ACTIONS.SET_CID,
    payload
  }),

  setLoading: (payload: boolean) => ({
    type: ACTIONS.LOADING,
    payload
  } as const),

  setPKey: (payload: string | null) => ({
    type: ACTIONS.SET_PKEY,
    payload
  }),

  setItems: (payload: {
    id: number, pic: null, name: string }[]) => (
    { type: ACTIONS.SET_ITEMS, payload } as const),

  setPic: (payload:{
    id: number, pic: string | null, name: string }) => (
    { type: ACTIONS.SET_PIC, payload } as const),

  setError: (
    payload: {
      code: number;
      status: string;
      message: string;
    } | null
  ) => ({
    type: ACTIONS.ERROR,
    payload
  } as const)
};

export type ActionCreators = ReturnType<PropertiesType<typeof AC>>;

export default AC;
