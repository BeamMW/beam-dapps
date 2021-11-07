declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.wasm';
declare module 'qwebchannel' {
  export const enum QWebChannelMessageTypes {
    signal = 1,
    propertyUpdate = 2,
    init = 3,
    idle = 4,
    debug = 5,
    invokeMethod = 6,
    connectToSignal = 7,
    disconnectFromSignal = 8,
    setProperty = 9,
    response = 10
  }

  export type QWebChannelTransport = {
    webChannelTransport: WebSocket;
  };

  export type ApiResult = {
    connect: (callback: (arg: string) => void) => void;
    disconnect: (callback: (arg: string) => void) => void;
  };

  export type ApiResultWeb = ((callback: (arg: string) => void) => void);
  export type CallApiDesktop = (json: string) => void;
  export type CallApiWeb = (
    callid: string, method: string, params: Params) => void;
  export type QObject = {
    callWalletApi: CallApiDesctop | CallApi,
    callWalletApiResult: ApiResult
    | ApiResultWeb;
    apiResult$: ApiResult$;
    callApi: (callid: string, method: string, params: Params) => void;
    initializeShader: (contract: string, name: string) => void;
  };

  export type QBEAM = {
    api: QObject;
  };

  export class QWebChannel {
    constructor(
      transport: WebSocket,
      initCallback: (channel: QWebChannel) => void
    );
    objects: {
      BEAM: QBEAM;
    };
  }
}

declare module 'formProps' {
  import { FormActions } from '../constants/variables';

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
}

declare module 'beamApiProps' {
  import BaseComponent from '../components/base/base.component';

  export type PropertiesType<T> = T extends { [key: string]: infer U }
    ? U : never;

  export type ApiArgs = {
    callID: ReqID,
    method: ReqMethods,
    params: BeamApiParams
  };

  export type APIResponse = {
    id: ReqIds;
    jsonrpc: string;
    result: {
      [key:string];
      output: string;
      txid: string;
      txId: string;
      raw_data: number[];
      comment: ResTXComment;
      status_string: ResTXStatus;
      failure_reason: string;
      metadata_pairs: IAssetMeta;
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
    [key:string | number]: never | string | number | ResponseResultType
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
    [key: string]: any
    contract?: number[];
    create_tx?: boolean;
    args?: string;
    data?: number[];
    txId?:string;
    asset_id?: number
  };
}
