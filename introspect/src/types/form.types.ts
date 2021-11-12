import { BaseComponent } from '@components/shared';
import { FormActions } from '@constants/app-shader';
import { ActionTypes } from '@logic/action-creators/action-creators';
import { IActionParams, IOutput } from './beam.types';

export type PropertiesType<T> = T extends { [key: string]: infer U }
  ? U : never;

export type FormDispatch = (obj: ActionTypes, sync?: 'sync') => void;

export type AddObsever = (element: BaseComponent) => void;

export type ParamPayloadArgsType = { key:string, value: string };

export type IsObserverType = (element: BaseComponent) => boolean;

export type ActionPayloadArgsType = {
  action: string,
  params: IActionParams
};

export interface IFormState {
  role: string | null;
  onload: Set<string>;
  fileName: string;
  txs: Map<string, string>;
  defaultCid: null | string;
  error: {
    msg: string;
    code: number | null;
    data: string;
  }
}

export type InformArgs = {
  formAction: FormActions
  currentRole: string;
  currentAction: string;
  output: IOutput;
  currentParams: IActionParams
  dispatch: FormDispatch;
  addObserver: AddObsever;
};
