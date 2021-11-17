declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.wasm';
declare class QWebChannel {
  constructor(
    transport: WebSocket,
    initCallback: (channel: QWebChannel) => void
  );

  objects: {
    BEAM: QBEAM;
  };
}
declare interface Window {
  qt: QWebChannelTransport;
  BeamApi: QObject;
}
