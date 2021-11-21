import {
  ApiResult, ApiResultWeb, BeamApiRes, CallApiDesktop, QObject
} from '@types';

export class BeamAPI {
  private API: null | QObject;

  private contract: ArrayBuffer | null;

  private readonly callbacks: Map<string, ((res: BeamApiRes) => void)>;

  constructor() {
    this.API = null;
    this.contract = null;
    this.callbacks = new Map();
  }

  private readonly onApiResult = (json: string): void => {
    const parsed = JSON.parse(json) as BeamApiRes;
    console.log('response', parsed);
    const { id } = parsed;
    const cb = this.callbacks.get(id);
    if (cb) {
      cb(parsed);
      this.callbacks.delete(id);
    }
  };

  connectToWebWallet = (
    message: { [key: string]: string }
  ) => new Promise<QObject>(
    (resolve) => {
      window.addEventListener('message', async (ev) => {
        if (window.BeamApi) {
          const webApiResult = window
            .BeamApi.callWalletApiResult as ApiResultWeb;
          if (ev.data === 'apiInjected') {
            await webApiResult(this.onApiResult);
            resolve(window.BeamApi);
          }
        }
      }, false);
      window.postMessage(message, window.origin);
    }
  );

  connectToApi = async ():Promise<QObject> => {
    const { qt } = window;
    const api = await new Promise<QObject>(
      (resolve) => new QWebChannel(qt.webChannelTransport, (channel) => {
        resolve(channel.objects.BEAM.api);
      })
    );
    (<ApiResult>api.callWalletApiResult).connect(this.onApiResult);
    return api;
  };

  readonly loadAPI = async (
    message: { [key: string]: string }
  ): Promise<BeamAPI> => {
    const ua = navigator.userAgent;
    try {
      this.API = /QtWebEngine/i.test(ua)
        ? await this.connectToApi()
        : await this.connectToWebWallet(message);
    } catch {
      throw new Error();
    }
    return this;
  };

  initContract = async (
    shader: string, callback?: (res:BeamApiRes) => void
  ) => {
    this.contract = await fetch(shader)
      .then((response) => response.arrayBuffer());
    if (this.contract) {
      this.callApi({
        callID: 'Check',
        method: 'invoke_contract',
        params: {
          create_tx: false
        }
      }, callback);
    }
  };

  readonly initShader = (shader: ArrayBuffer): void => {
    this.contract = shader;
  };

  readonly callApi = ({
    callID, method, params
  }: {
    callID: string,
    method: string,
    params: {
      [key:string]:string | number | boolean | number[]
    }
  }, callback?: (res:BeamApiRes) => void): void => {
    if (this.contract) {
      const contract = Array.from(new Uint8Array(this.contract));
      const id = `${callID}(${new Date().getTime()})`;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params: { ...params, contract }
      };
      if (callback) this.callbacks.set(id, callback);
      console.log('request: ', request);
      if (window.BeamApi) {
        window.BeamApi.callWalletApi(id, method, { ...params, contract });
      } else {
        (this.API?.callWalletApi as CallApiDesktop)(JSON.stringify(request));
      }
    }
  };
}
