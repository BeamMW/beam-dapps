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
    connect: (callback:(arg:string) => void) => void
    disconnect: (callback:(arg:string) => void) => void
  };

  export type ApiResult$ = {
    handlers: (arg: string)=>void[];
    subscribe:(callback:(json: string)=>void)=> void
  };

  export type QObject = {
    callWalletApi: (json:string) => void
    callWalletApiResult: ApiResult;
    apiResult$: ApiResult$;
    initializeShader: (contract:ArrayBuffer, name: string) => void;
  };

  export type QBEAM = {
    api: QObject
  };

  export class QWebChannel {
    constructor(
      transport: WebSocket,
      initCallback: (channel: QWebChannel) => void
    );
    objects: {
      BEAM: QBEAM
    };
  }
}
