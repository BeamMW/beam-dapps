import { BeamApiParams } from './beam.types';

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
  callid: string, method: string, params: BeamApiParams) => void;
export type QObject = {
  callWalletApi: CallApiDesktop | CallApiWeb,
  callWalletApiResult: ApiResult | ApiResultWeb;
  callApi: (callid: string, method: string, params: BeamApiParams) => void;
  initializeShader: (contract: string, name: string) => void;
};

export type QBEAM = {
  api: QObject;
};
