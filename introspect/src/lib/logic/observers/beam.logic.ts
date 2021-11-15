import {
  APIResponse,
  ApiResult,
  ApiResultWeb,
  CallApiDesktop,
  PropertiesType,
  QObject, QWebChannelTransport
} from '@alltypes';
import { BaseComponent } from '@components/shared';
import { RC } from '@logic/action-creators';
import Observer from './observer';

declare global {
  interface Window {
    qt: QWebChannelTransport;
    BeamApi: QObject;
  }
}

type RequestType = ReturnType<PropertiesType<typeof RC>>;

export default class BeamAPI extends Observer<APIResponse> {
  private API: null | QObject;

  private contract: ArrayBuffer | null;

  constructor() {
    super();
    this.API = null;
    this.contract = null;
  }

  readonly subscribe = (...components: BaseComponent[]): void => {
    components.forEach((component) => {
      this.attach(component.inform!);
      component.element
        .addEventListener(
          'DOMNodeRemovedFromDocument',
          () => this.deleteSubscriber(component.inform!)
        );
    });
  };

  private readonly onApiResult = (json: string): void => {
    const parsed = JSON.parse(json) as APIResponse;
    console.log('response', parsed);
    this.notifyAll(parsed);
  };

  readonly loadAPI = async (ua:string): Promise<BeamAPI> => {
    const { qt } = window;
    if (/QtWebEngine/i.test(ua)) {
      this.API = await new Promise<QObject>(
        (resolve) => new QWebChannel(qt.webChannelTransport, (channel) => {
          resolve(channel.objects.BEAM.api);
        })
      );
      (this.API?.callWalletApiResult as ApiResult).connect(this.onApiResult);
    } else {
      this.API = await new Promise<QObject>((resolve) => {
        window.addEventListener(
          'message',
          async (ev) => {
            if (window.BeamApi) {
              const webApiResult = window.BeamApi
                .callWalletApiResult as ApiResultWeb;
              if (ev.data === 'apiInjected') {
                await webApiResult(this.onApiResult);
                resolve(window.BeamApi);
              }
            }
          },
          { once: false }
        );
        window.postMessage(
          {
            type: 'create_beam_api',
            apiver: 'current',
            apivermin: '',
            appname: 'BEAM INTROSPECTR'
          },
          window.origin
        );
      });
    }
    return this;
  };

  readonly initShader = (shader: ArrayBuffer): void => {
    this.contract = shader;
  };

  readonly callApi = ({
    callID,
    method,
    params,
    files
  }: RequestType): void => {
    if (files) this.initShader(files);
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
        (<CallApiDesktop> this.API?.callWalletApi)(JSON.stringify(request));
      }
    }
  };
}
