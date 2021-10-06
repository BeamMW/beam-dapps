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

  type ApiResultWeb = ((callback: (arg: string) => void) => void);
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

declare module 'AppStateProps' {

  type PopupKeys = import('../constants/app').PopupKeys;

  export type BoardType = (number[])[];

  export interface IAppState {
    [key:string];
    has_active_game: number;
    time: number;
    autoPlay: boolean;
    pending_rewards: number;
    isTx: boolean;
    popup: PopupKeys | false;
    prizeFund: number;
    asset: {
      name: string,
      color: string
    };
  }

  export interface IState{
    grid:IGridState;
    info:IAppState;
    cid: ICidState;
  }

  export interface IGridState {
    board: BoardType | null;
    permutation: number | null;
    solution: ('u' | 'd' | 'r' | 'l')[];
    status: 'ready' | 'playing' | 'won';
  }

  export interface ICidState {
    max_bet: number;
    min_bet: number;
    prize_aid: number;
    prize_amount: number;
    prize_fund: number;
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
  type AppState = import('AppStateProps').IAppState;
  type CidState = import('AppStateProps').ICidState;
  type GridState = import('AppStateProps').IGridState;
  type WinArgsType = import('ComponentProps').WinArgsType;

  export type PropertiesType<T> = T extends { [key: string]: infer U }
    ? U : never;

  export type PlayerInfoType = {
    activeGame: boolean;
    reward: number;
  };

  export interface IAssetMeta {
    N: string;
    OPT_COLOR: string;
  }

  export type APIResponse = {
    id: ReqIds;
    jsonrpc: string;
    result: {
      [key:string];
      output?: string;
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
    }
  };

  export type ResOutput = CidState & AppState & GridState & WinArgsType;

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

  export type BoardLengthType = 3 | 4 | 5;

  export type BeamApiParams = {
    contract?: number[];
    create_tx?: boolean;
    args?: string;
    data?: number[];
    txId?:string;
    asset_id?: number
  };
}

declare module 'ComponentProps' {

  export type GameInfoCb = {
    value: string,
    result: boolean,
    color?: string
  };

  export type GameInfoParams = {
    title: string,
    icon: string,
    callback:(state: IState) => GameInfoCb
  };

  export type WinArgsType = {
    verdict: string;
    ['time (min)']: number;
  };

  export type MenuButtonType = {
    key: MenuBtn,
    title: string,
    icon?: string,
    handler?: (arg?) => void;
  };

  export type CellToRender = {
    index: number,
    x: number,
    y: number,
    solution: 'u' | 'd' | 'r' | 'l'
  };
}
