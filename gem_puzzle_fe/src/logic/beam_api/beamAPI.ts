import { PropertiesType } from 'beamApiProps';
import { QWebChannel, QWebChannelTransport, QObject } from 'qwebchannel';
import { RC } from './request_creators';
import shader from './app.wasm';
import BaseComponent from '../../components/base/base.component';
import { ReqID, ReqMethods, AppSpecs } from '../../constants/api_constants';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    beam: QObject;
  }
}

export class BeamAPI {
  private API: null | QObject;

  private contract: ArrayBuffer | null;

  private readonly observers: Set<BaseComponent>;

  constructor() {
    this.API = null;
    this.contract = null;
    this.observers = new Set();
  }

  readonly addObservers = (...components: BaseComponent[]): void => {
    components.forEach((component) => {
      this.observers.add(component);
      component.element
        .addEventListener(
          'DOMNodeRemovedFromDocument', () => this.deleteObserver(component)
        );
    });
  };

  private readonly deleteObserver:(
    component: BaseComponent
  ) => void = (component: BaseComponent) => {
    this.observers.delete(component);
  };

  private readonly onApiResult = (json: string): void => {
    const res = JSON.parse(json);
    console.log('response: ', res);
    this.observers.forEach((component: BaseComponent) => {
      if (component.inform) {
        component.inform(res);
      }
    });
  };

  readonly loadAPI = async (): Promise<void> => {
    const { qt, beam } = window;
    if (beam) {
      window.beam.apiResult$.subscribe(this.onApiResult);
      this.API = beam;
    } else {
      this.API = await new Promise<QObject>(
        (resolve) => new QWebChannel(qt.webChannelTransport, (channel) => {
          resolve(channel.objects.BEAM.api);
        })
      );
      this.API?.callWalletApiResult.connect(this.onApiResult);
    }
    this.contract = await fetch(shader)
      .then((response) => response.arrayBuffer());
    if (this.contract) {
      this.initShader();
      this.callApi({
        callID: ReqID.CHECK,
        method: ReqMethods.INVOKE_CONTRACT,
        params: {
          contract: Array.from(new Uint8Array(this.contract)),
          create_tx: false
        }
      });
    }
  };

  private readonly initShader = (): void => {
    if (window.beam) {
      window.beam.initializeShader(AppSpecs.CID, AppSpecs.TITLE);
    }
  };

  readonly callApi = (
    { callID, method, params } : ReturnType<
    PropertiesType<typeof RC>
    >
  ): void => {
    if (this.contract) {
      const contract = Array.from(new Uint8Array(this.contract));
      const request = {
        jsonrpc: '2.0',
        id: callID,
        method,
        params: { ...params, contract }
      };
      console.log('request: ', request);
      if (window.beam) {
        window.beam.callApi(callID, method, { ...params, contract });
      } else {
        this.API?.callWalletApi(JSON.stringify(request));
      }
    }
  };
}
