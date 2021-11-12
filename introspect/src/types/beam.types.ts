import { BaseComponent } from '@components/shared';
import { ReqID, ReqMethods, ResTXStatus } from '@constants/app-shader';

export type ApiArgs = {
  callID: string,
  method: ReqMethods,
  params: BeamApiParams,
  files?: ArrayBuffer
};

export type APIResponse = {
  id: ReqID;
  jsonrpc: string;
  result: {
    [key:string]: string | number[]
    output: string;
    txid: string;
    txId: string;
    raw_data: number[];
    status_string: ResTXStatus;
    failure_reason: string;
  };
  error?: {
    code:number;
    message: string;
    data: string;
  }
};

export interface IActionParams {
  [key: string]: string;
}

export interface IActionOutput {
  [key: string]: never | IActionParams;
}

export interface IRoleOutput {
  [key: string]: IActionOutput;
}

export type ResponseResultType = {
  [key:string]: never | string | number | ResponseResultType
};

export type IOutput = {
  [key: string]: IRoleOutput | IActionOutput;
} | IActionOutput;

export type CallApiType =
(obj:ApiArgs) => void;

export type AddObserversType = (...components: BaseComponent[]) => void;

export type DeleteObserverType = (components: BaseComponent) => void;

export type InitShaderType = (shader:ArrayBuffer) => void;

export type BeamApiHandlers = {
  callApi: CallApiType;
  subscribe: AddObserversType;
  deleteObserver: DeleteObserverType;
  initShader: InitShaderType;
};

export type BoardType = number[][];

export type BeamApiParams = {
  contract?: number[];
  create_tx?: boolean;
  args?: string;
  data?: number[];
  txId?:string;
  asset_id?: number
};
