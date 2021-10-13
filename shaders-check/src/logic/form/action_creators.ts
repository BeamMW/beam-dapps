import { FormActions } from '../../constants/variables';

export const setRoleAC = (payload:string) => (
  { action: FormActions.SET_ROLE, payload } as const
);
export const setOnloadAC = (payload: string) => (
  { action: FormActions.SET_ONLOAD, payload } as const
);
export const deleteOnloadAC = (payload: string) => (
  { action: FormActions.DELETE_ONLOAD, payload } as const
);

export type ActionTypes = ReturnType<
  typeof setRoleAC
| typeof setOnloadAC
| typeof deleteOnloadAC
>;
