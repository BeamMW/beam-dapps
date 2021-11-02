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
import BaseComponent from '../../components/shared/base/base.component';
import { RC } from './request-creators';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    BeamApi: QObject;
    clipboardData: any;
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

  readonly subscribe = (...components: BaseComponent[]): void => {
    components.forEach((component) => {
      this.observers.add(component);
      component.element
        .addEventListener(
          'DOMNodeRemovedFromDocument', () => this.deleteSubscriber(component)
        );
    });
  };

  private readonly onApiResult = (json: string): void => {
    const parsed = JSON.parse(json);
    console.log('response', parsed);
    this.observers.forEach((element: BaseComponent) => {
      if (element.inform) element.inform(parsed);
    });
  };

  deleteSubscriber = (component: BaseComponent):void => {
    this.observers.delete(component);
  };

  readonly loadAPI = async (): Promise<BeamAPI> => {
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
    return this;
  };

  readonly initShader = (shader:ArrayBuffer):void => {
    this.contract = shader;
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
