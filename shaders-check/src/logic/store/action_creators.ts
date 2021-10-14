import { FormActions } from '../../constants/variables';

export const setRoleAC = (payload:string | null) => (
  { action: FormActions.SET_ROLE, payload } as const
);
export const setOnloadAC = (payload: string) => (
  { action: FormActions.SET_ONLOAD, payload } as const
);
export const deleteOnloadAC = (payload: string) => (
  { action: FormActions.DELETE_ONLOAD, payload } as const
);
export const setFileNameAC = (payload: string) => (
  { action: FormActions.SET_FILENAME, payload } as const
);

export type ActionTypes = ReturnType<
  typeof setRoleAC
| typeof setOnloadAC
| typeof deleteOnloadAC
| typeof setFileNameAC
>;
