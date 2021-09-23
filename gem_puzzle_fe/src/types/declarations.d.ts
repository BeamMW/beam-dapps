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

  export type ApiResult$ = {
    handlers: (arg: string) => void[];
    subscribe: (callback: (json: string) => void) => void;
  };

  export type QObject = {
    callWalletApi: (json: string) => void;
    callWalletApiResult: ApiResult;
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

declare module 'AppStateProps' {

  type BoardType = import('beamApiProps').BoardType;

  export interface IAppState {
    [key:string];
    activeGame: boolean;
    move: string;
    time: number;
    rate: number;
    pKey: string;
    autoPlay: boolean;
    reward: number;
    isTx: boolean
  }

  export interface IState{
    grid:IGridState;
    info:IAppState

  }

  export interface IGridState {
    board: BoardType | null;
    solution: ('u' | 'd' | 'r' | 'l')[];
    time: number;
    status: 'ready' | 'playing' | 'won';
  }

  export type PropertiesType<T> = T extends { [key: string]: infer U }
    ? U : never;
}

declare module 'beamApiProps' {

  type BaseComponent = import('../components/base/base.component').default;
  type ResTXComment = import('../constants/api').ResTXComment;
  type ResTXStatus = import('../constants/api').ResTXStatus;
  type ReqID = import('../constants/api').ReqID;
  type ReqMethods = import('../constants/api').ReqMethods;

  export type PropertiesType<T> = T extends { [key: string]: infer U }
    ? U : never;

  export type PlayerInfoType = {
    ['My public key']: string;
    has_active_game: boolean;
    pending_rewards: number;
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
      board?:BoardType;
    };
    error?: {
      code:number;
      message: string;
    }
  };

  export type ApiArgs = {
    callID: ReqID,
    method: ReqMethods,
    params: BeamApiParams
  };

  export type CallApiType =
  (obj:ApiArgs) => void;

  export type AddObserversType = (component: BaseComponent) => void;

  export type BeamApiHandlers = {
    callApi: CallApiType,
    addObservers: AddObserversType
  };

  export type BoardType = (number[])[];

  export type BoardLengthType = 3 | 4 | 5;

  export type BeamApiParams = {
    contract?: number[];
    create_tx?: boolean;
    args?: string;
    data?: number[];
    txId?:string
  };
}

declare module 'ComponentProps' {
  export type WinArgsType = {
    verdict: string;
    moves: number;
    ['time (min)']: number;
  };

  export type MenuButtonType = {
    key: MenuBtn,
    title: string,
    icon?: string,
    handler: (arg?) => void;
  };

  export type CellToRender = {
    index: number,
    x: number,
    y: number,
    solution: 'u' | 'd' | 'r' | 'l'
  };
}
