import { FormActions } from '../constants/variables';

export const setRoleAC = (payload:string) => (
  { action: FormActions.SET_ROLE, payload }
);
export const setActionAC = (payload:string) => (
  { action: FormActions.SET_ACTION, payload }
);

export type ActionTypes = ReturnType<typeof setRoleAC | typeof setActionAC>;
