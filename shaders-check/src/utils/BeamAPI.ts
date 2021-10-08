import {
  PropertiesType
} from 'beamApiProps';
import {
  QWebChannel,
  QWebChannelTransport,
  QObject,
  ApiResult,
  ApiResultWeb
} from 'qwebchannel';
import BaseComponent from '../components/BaseComponent/base.component';
import { RC } from './request_creators';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    BeamApi: QObject;
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

  onApiResult = (json: string): void => {
    const parsed = JSON.parse(json);
    console.log('response', parsed);
    this.observers.forEach((element: BaseComponent) => {
      if (element.inform) element.inform(parsed);
    });
  };

  deleteObserver = (component: BaseComponent):void => {
    this.observers.delete(component);
  };

  readonly loadAPI = async (): Promise<void> => {
    const { qt } = window;
    const ua = navigator.userAgent;
    if (/QtWebEngine/i.test(ua)) {
      this.API = await new Promise<QObject>(
        (resolve) => new QWebChannel(qt.webChannelTransport, (channel) => {
          resolve(channel.objects.BEAM.api);
        })
      );
      (this.API?.callWalletApiResult as ApiResult).connect(this.onApiResult);
    } else {
      this.API = await new Promise<QObject>((resolve) => {
        window.addEventListener('message', async (ev) => {
          if (window.BeamApi) {
            const webApiResult = window
              .BeamApi
              .callWalletApiResult as ApiResultWeb;
            if (ev.data === 'apiInjected') {
              await webApiResult(this.onApiResult);
              resolve(window.BeamApi);
            }
          }
        }, { once: false });
        window.postMessage({
          type: 'create_beam_api',
          apiver: 'current',
          apivermin: '',
          appname: 'BEAM INTROSPECTR'
        }, window.origin);
      });
    }
  };

  initShader = (shader:ArrayBuffer):void => {
    this.contract = shader;
    // if (window.BeamApi) {
    //   window.BeamApi.initializeShader(
    //     '50ab294a5ff6cedcfd74860898faf3f00967b9f1296c94f19dec24f2ab55595f',
    //     'faucet'
    //   );
    // }
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
      if (window.BeamApi) {
        window.BeamApi.callWalletApi(callID, method, { ...params, contract });
      } else {
        this.API?.callWalletApi(JSON.stringify(request));
      }
    }
  };
}