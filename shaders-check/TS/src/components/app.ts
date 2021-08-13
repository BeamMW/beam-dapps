import { QWebChannel } from 'qwebchannel';
import shader from '../shader.wasm';

export class App {
  private readonly rootElement: HTMLElement;

  private API: QWebChannel | null;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.API = null;
    this.loaderAPI();
  }

  onApiResult = (json: string):void => {
    console.log(JSON.parse(json));
  };

  loaderAPI = async (): Promise<void> => {
    const { qt } = window;
    this.API = await new Promise(
      (resolve) => new QWebChannel(qt.webChannelTransport, (channel) => resolve(channel.objects.BEAM))
    );
    const contract = await fetch(shader).then((response) => response.arrayBuffer());
    if (this.API) {
      this.API.api.callWalletApiResult.connect(this.onApiResult);
      this.callApi('form-generator', 'invoke_contract', {
        contract: Array.from(new Uint8Array(contract)),
        create_tx: false,
        args: 'role=manager,action=view'
      });
    }
  };

  callApi = (callid:string, method:string, params:any):void => {
    const request = {
      jsonrpc: '2.0',
      id: callid,
      method,
      params
    };
    if (this.API) {
      this.API.api.callWalletApi(JSON.stringify(request));
    }
  };
}
