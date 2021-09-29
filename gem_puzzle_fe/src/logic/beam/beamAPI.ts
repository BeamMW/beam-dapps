import { PropertiesType } from 'beamApiProps';
import {
  QWebChannel,
  QWebChannelTransport,
  QObject,
  ApiResult,
  ApiResultWeb
} from 'qwebchannel';
import { RC } from './request_creators';
import shader from './app.wasm';
import BaseComponent from '../../components/base/base.component';
import { AppSpecs } from '../../constants/api';

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
            const webApiResult = window.BeamApi.callWalletApiResult as ApiResultWeb;
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
          appname: 'BEAM GEM_PUZZLE'
        }, window.origin);
      });
    }
    this.contract = await fetch(shader)
      .then((response) => response.arrayBuffer());
    if (this.contract) {
      // this.initShader();
      this.callApi(RC.viewCidParams());
    }
  };

  readonly initShader = (): void => {
    if (window.BeamApi) {
      window.BeamApi.initializeShader(AppSpecs.CID, AppSpecs.TITLE);
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
      if (window.BeamApi) {
        window.BeamApi.callWalletApi(callID, method, { ...params, contract });
      } else {
        this.API?.callWalletApi(JSON.stringify(request));
      }
    }
  };
}
