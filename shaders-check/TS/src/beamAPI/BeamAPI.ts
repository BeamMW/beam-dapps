import { APIResponse, BeamApiHandlers, BeamApiParams } from 'beamApiProps';
import { QWebChannel, QWebChannelTransport, QObject } from 'qwebchannel';
import BaseComponent from '../components/BaseComponent/base.component';
// import shader from '../shader.wasm';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    beam: QObject;
  }
}

export interface ObserverComponent extends BaseComponent {
  inform: (state: BeamApiHandlers, object: APIResponse) => void;
}

export class BeamAPI {
  private API: null | QObject;

  private contract: ArrayBuffer | null;

  private readonly observers: ObserverComponent[];

  constructor() {
    this.API = null;
    this.contract = null;
    this.observers = [];
  }

  addObservers = (...components: ObserverComponent[]): void => {
    components.forEach((component) => {
      this.observers.push(component);
    });
  };

  onApiResult = (json: string): void => {
    this.observers.forEach((element: ObserverComponent) => {
      element.inform(
        {
          initShader: this.initShader,
          callApi: this.callApi
        },
        JSON.parse(json)
      );
    });
  };

  loadAPI = async (): Promise<void> => {
    const { qt, beam } = window;
    if (beam) {
      window.beam.apiResult$.subscribe(this.onApiResult);
      this.API = beam;
    } else {
      this.API = (await new Promise<QObject>(
        (resolve) => new QWebChannel(
          qt.webChannelTransport, (channel) => {
            resolve(channel.objects.BEAM.api);
          }
        )
      ));
      this.API?.callWalletApiResult.connect(this.onApiResult);
    }
  };

  initShader = (shader:ArrayBuffer):void => {
    this.contract = shader;
    if (window.beam) {
      window.beam.initializeShader(
        '50ab294a5ff6cedcfd74860898faf3f00967b9f1296c94f19dec24f2ab55595f',
        'faucet'
      );
    }
  };

  callApi = (callid: string, method: string, params: BeamApiParams): void => {
    if (this.contract) {
      const contract = Array.from(new Uint8Array(this.contract));
      const request = {
        jsonrpc: '2.0',
        id: callid,
        method,
        params: { ...params, contract }
      };
      if (window.beam) {
        window.beam.callApi(callid, method, { ...params, contract });
      } else {
        this.API?.callWalletApi(JSON.stringify(request));
      }
    }
  };
}
