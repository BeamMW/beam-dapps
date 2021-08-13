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
  declare global {
    interface Window {
      qt: any;
    }
  }
  export type QWebChannelTransport = {
    webChannelTransport: any;
  };

  type ApiResult = {
    connect: (callback:(arg:string) => void) => void
    disconnect: (callback:(arg:string) => void) => void
  };

  type QObject = {
    callWalletApi: (json:sting) => void
    callWalletApiResult: ApiResult
  };

  export class QWebChannel {
    constructor(
      transport: WebSocket,
      initCallback: (channel: QWebChannel) => void
    );
    api: QObject;

    objects: any;

    send(data: any): void;
    exec(data: any, callback: (data: any) => void): void;
    handleSignal(message: MessageEvent): void;
    handleResponse(message: MessageEvent): void;
    handlePropertyUpdate(message: MessageEvent): void;
  }
}
