import fs from 'fs';
import request from 'request';

export class BeamApi {
	set api(api) {
		this._api = api;
	}
	
	set wasm(link) {
		this._shader = this.readWasmFile(link);
	}
	
	set cid(cid) {
		this._cid = cid;
	}
	
  readWasmFile = (link) => {
    if (typeof link === 'string') {
      return Array.from(new Uint8Array(fs.readFileSync(link)));
    } else throw new Error('the wasm link is not type of string');
  };
  
	isTxCheck = (method) => {
    if (!(/(tx_status|get_utxo|tx_split)/i.test(method))) return true;
  };

  responseErrorHandler = ({ error, info, body }) => {
    if (!error && info.statusCode === 200) {
    return body;
    } else throw new Error(error);
  };

  argsStringify = args => Object.entries(args)
      .filter(arg => arg[1].length)
      .map(arg => arg.join('='))
      .join(',');
  
  callApiHandler = (id, method, params) =>  (resolve, reject) => request.post(
        this._api,
        {
          json: {
            jsonrpc: '2.0',
            id,
            method,
            params
          }
        },
        (error, info, body) => {
          try {
            const res = this.responseErrorHandler({ error, info, body });
            resolve(res);
          } catch (error) {
            reject(error);
          }
        }
      );

  callApi = ({ id, method, params }) => {
  if(!(this._cid && this._api && this._shader)) throw new Error('miss some args')
    const modifiedParams = { ...params };
		if (this.isTxCheck(method)) {
      modifiedParams.contract = this._shader;
      modifiedParams.args.cid = this._cid;
    }
    if (params.args) modifiedParams.args = this.argsStringify(params.args);
    return new Promise(this.callApiHandler(id, method, modifiedParams));
  };
}
