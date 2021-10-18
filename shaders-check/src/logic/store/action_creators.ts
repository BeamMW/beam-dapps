import { PropertiesType } from 'formProps';
import { FormActions } from '../../constants/variables';

export const AC = {
  setRole: (payload:string | null) => (
    { action: FormActions.SET_ROLE, payload } as const
  ),
  setOnload: (payload: string) => (
    { action: FormActions.SET_ONLOAD, payload } as const
  ),
  deleteOnload: (payload: string) => (
    { action: FormActions.DELETE_ONLOAD, payload } as const
  ),
  setFileName: (payload: string) => (
    { action: FormActions.SET_FILENAME, payload } as const
  ),
  setTxs: (payload: { key: string, value: string }) => (
    { action: FormActions.SET_TXS, payload } as const
  ),
  removeTxs: (payload: string) => (
    { action: FormActions.REMOVE_TXS, payload } as const
  )
};

export type ActionTypes = ReturnType<PropertiesType<typeof AC>>;
