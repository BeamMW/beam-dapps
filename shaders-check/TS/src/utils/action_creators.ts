import { FormActions } from '../constants/variables';

export const setRoleAC = (payload:any) => (
  { action: FormActions.SET_ROLE, payload }
);
export const setActionAC = (payload:any) => (
  { action: FormActions.SET_ACTION, payload }
);
