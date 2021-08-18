import { QWebChannel, QWebChannelTransport, QObject } from 'qwebchannel';
import BaseComponent from '../components/BaseComponent/base.component';
import shader from '../shader.wasm';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    beam: QObject;
  }
}

export interface ObserverComponent extends BaseComponent {
  inform: (state: BeamAPI) => void;
}

type Params = {
  contract: number[];
  create_tx: boolean;
  args: string;
};

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
      element.inform(JSON.parse(json));
    });
  };

  loadAPI = async (): Promise<void> => {
    const { qt, beam } = window;
    if (beam) {
      window.beam.apiResult$.subscribe(this.onApiResult);
      this.API = beam;
    } else {
      this.API = (await new Promise<QObject >(
        (resolve) => new QWebChannel(
          qt.webChannelTransport, (channel) => {
            resolve(channel.objects.BEAM.api);
          }
        )
      ));
      this.API?.callWalletApiResult.connect(this.onApiResult);
    }
    await this.initShader();
  };

  initShader = async ():Promise<void> => {
    if (window.beam && this.contract) {
      await this.API?.initializeShader(this.contract, 'some shader');
    } else {
      this.contract = await fetch(shader)
        .then((response) => response.arrayBuffer()) as ArrayBuffer;
    }
  };

  callApi = (callid: string, method: string, params: Params): void => {
    if (this.contract && this.API) {
      const contract = Array.from(new Uint8Array(this.contract));
      const request = {
        jsonrpc: '2.0',
        id: callid,
        method,
        params: { ...params, contract }
      };
      this.API.callWalletApi(JSON.stringify(request));
    }
  };
}
