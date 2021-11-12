declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.wasm';
declare module '@alltypes' {
  export * from '@apptypes/beam.types';
  export * from '@apptypes/form.types';
  export * from '@apptypes/qwebchannel.types';
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
