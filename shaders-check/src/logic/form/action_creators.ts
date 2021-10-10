import { ActionPayloadArgsType, ParamPayloadArgsType } from 'formProps';
import BaseComponent from '../../components/shared/base/base.component';
import { FormActions } from '../../constants/variables';

export const setRoleAC = (payload:string) => (
  { action: FormActions.SET_ROLE, payload }
);
export const setActionAC = (payload: ActionPayloadArgsType) => (
  { action: FormActions.SET_ACTION, payload }
);
export const setParamValueAC = (payload:ParamPayloadArgsType) => (
  { action: FormActions.SET_PARAM_VALUE, payload }
);

export const unsubscribeBeforeRemoveAC = (payload:BaseComponent) => (
  { action: FormActions.UNSUBSCRIBE, payload }
);

export type ActionTypes = ReturnType<typeof setRoleAC
| typeof setActionAC
| typeof setParamValueAC>;
