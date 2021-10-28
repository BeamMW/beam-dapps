const MIN_AMOUNT = 0.00000001;
const MAX_AMOUNT = 254000000;

export default class Utils {
    //
    // API Exposed by the wallet itself
    //
    static BEAM   = null
    static APP    = null
    static CallID = 0
    static Calls  = {}

    static onLoad(creator) {
        window.addEventListener('load', () => new QWebChannel(qt.webChannelTransport, (channel) => {
            Utils.BEAM = channel.objects.BEAM
            Utils.onApiResult((...args) => Utils.handleApiResult(...args))
            Utils.APP = creator(Utils.BEAM)
            Utils.APP.start()
        }))
    }

    static reload () {
        window.location.reload()
    }

    static hex2rgba = (hex, alpha = 1) => {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    }

    static getById = (id)  => {
        return document.getElementById(id);
    }
    
    static setText(id, text) {
        Utils.getById(id).innerText = text
    }

    static show(id) {
        this.getById(id).classList.remove("hidden");
    }
    
    static hide(id) {
        this.getById(id).classList.add("hidden");
    }

    static formatJSON(obj) {
        let res = JSON.stringify(obj, null, 2)
        return res == "{}" ? obj.toString() : res
    }

    static download(url, cback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let buffer    = xhr.response
                    let byteArray = new Uint8Array(buffer);
                    let array     = Array.from(byteArray)

                    if (!array || !array.length) {
                        return cback("empty shader")
                    }
                
                    return cback(null, array)
                } else {
                    return cback({code: xhr.status})
                }
            }
        }
        xhr.open('GET', url, true)
        xhr.responseType = "arraybuffer";
        xhr.send(null)
    }

    static callApi(method, params, cback) {
        let callid = ['call', Utils.CallID++].join('-')
        Utils.Calls[callid] = cback

        let request = {
            "jsonrpc": "2.0",
            "id":      callid,
            "method":  method,
            "params":  params
        }

        Utils.BEAM.api.callWalletApi(JSON.stringify(request))
    }

    static invokeContract(args, cback, bytes) {
        let params = {
            "create_tx": false
        }

        if (args) {
            params = Object.assign({
                "args": args
            }, params)
        }

        if (bytes) {
            params = Object.assign({
                "contract": bytes
            }, params)
        }

        return Utils.callApi('invoke_contract', params, cback)
    }

    static onApiResult(cback) {
        Utils.BEAM.api.callWalletApiResult.connect(cback)
    }

    static handleApiResult (json) {
        let answer = undefined
        try
        {
            answer = JSON.parse(json)
            const id = answer.id
            const hid = Utils.id2HandlerId(id)
            
            const cback = Utils.Calls[id] || (Utils.APP[hid] || Utils.APP.onApiResult).bind(Utils.APP)
            delete Utils.Calls[id]
            
            if (answer.error) {
                return cback(answer)
            }

            if (!answer.result) {
                return cback({
                    error: "no valid api call result", 
                    answer
                })
            }

            if (typeof answer.result.output == 'string') {
                // this is shader result
                let shaderAnswer = JSON.parse(answer.result.output)
                if (shaderAnswer.error) {
                    return cback({
                        error: shaderAnswer.error,
                        answer
                    })
                }
                return cback(null, shaderAnswer, answer)
            }
            else
            {
                return cback(null, answer.result, answer)
            }
        }
        catch (err)
        {
            Utils.APP.onApiResult({
                error: err.toString(),
                answer: answer || json
            })
        }
    }

    static id2HandlerId (id) {
        if (!id) {
            throw "no call id found"
        }
        return ['on', id[0].toUpperCase(), id.substr(1)].join('')
    }

    static ensureField(obj, name, type) {
        if (obj[name] == undefined) {
            throw `No '${name}' field on object`
        }

        if (type == 'array') {
            if (!Array.isArray(obj[name])) {
                throw `${name} is expected to be an array`
            }
            return
        }

        if (type) {
            let tof = typeof obj[name]
            if (tof !== type) {
                throw `Bad type '${tof}' for '${name}'. '${type}' expected.`
            }
            return
        }
    }

    static hexEncodeU8A (arr) {
        return arr.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    }

    static hexDecodeU8A (str) {
        return new Uint8Array(str.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }

    static isUserCancelled (err) {
        return err.error && err.error.code == -32021
    }
}
