const MIN_AMOUNT = 0.00000001;
const MAX_AMOUNT = 254000000;

let BEAM     = null
let CallID   = 0
let Calls    = {}
let APIResCB = undefined

export default class Utils {
    static isMobile () {
        const ua = navigator.userAgent;
        return (/android/i.test(ua) || /iPad|iPhone|iPod/.test(ua));
    }
    
    static isAndroid () {
        const ua = navigator.userAgent;
        return (/android/i.test(ua));
    }

    static isDesktop () {
        const ua = navigator.userAgent;
        return (/QtWebEngine/i.test(ua));
    }

    static isWeb () {
        return !Utils.isDesktop() && !Utils.isMobile()
    }

    static async createDesktopAPI(apirescback) {
        return new Promise(async (resolve, reject) => {
            await Utils.injectScript("qrc:///qtwebchannel/qwebchannel.js")
            new QWebChannel(qt.webChannelTransport, (channel) => {
                channel.objects.BEAM.api.callWalletApiResult.connect(apirescback)
                resolve(channel.objects.BEAM)
            })
        })  
    }

    static async createWebAPI(apiver, apivermin, appname, apirescback) {
        return new Promise((resolve, reject) => {
            window.addEventListener('message', async (ev) => {
                if (ev.data === 'apiInjected') {
                    await window.BeamApi.callWalletApiResult(apirescback);
                    resolve(window.BeamApi)
                }
            }, false);
            window.postMessage({type: "create_beam_api", apiver, apivermin, appname}, window.origin);
        })
    }

    static async createMobileAPI(apirescback) {
        return new Promise((resolve, reject) => {
            if (Utils.isAndroid()) {
                document.addEventListener("onCallWalletApiResult", (res) => {
                    apirescback(res.detail)
                })
            }
            else {
                window.BEAM.callWalletApiResult(apirescback);
            }
            resolve(window.BEAM);
        })
    }

    static async callApi(method, params, cback) {
        let callid = ['call', CallID++].join('-')
        Calls[callid] = cback

        let request = {
            "jsonrpc": "2.0",
            "id":      callid,
            "method":  method,
            "params":  params
        }

        console.log(Utils.formatJSON(request))

        if (Utils.isWeb()) {
            BEAM.callWalletApi(callid, method, params);
        } 

        if (Utils.isMobile()) {
            BEAM.callWalletApi(JSON.stringify(request));
        }
        
        if (Utils.isDesktop()) {
            BEAM.api.callWalletApi(JSON.stringify(request));
        }
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

    static handleApiResult (json) {
        let answer = undefined
        try
        {
            answer = JSON.parse(json);
           
            if (answer.result && answer.result.output) {
                console.log('Output: ', JSON.parse(answer.result.output));
            } else {
                console.log('Api result: ', answer);
            }
            
            const id = answer.id
            const cback = Calls[id] || APIResCB
            delete Calls[id]
            
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
            APIResCB({
                error: err.toString(),
                answer: answer || json
            })
        }
    }

    static async initialize(params, initcback) {
        APIResCB = params["apiResultHandler"]
        
        try
        {
            if (Utils.isDesktop()) {
                BEAM = await Utils.createDesktopAPI((...args) => Utils.handleApiResult(...args))
            } 
            
            if (Utils.isWeb()) {
                Utils.showWebLoading()
                let apiver    = params["api_version"] || "current"
                let apivermin = params["min_api_version"] || ""
                let appname   = params["appname"]
                BEAM = await Utils.createWebAPI(apiver, apivermin, appname, (...args) => Utils.handleApiResult(...args))
                Utils.hideWebLoading()
            }

            if (Utils.isMobile()) {
                BEAM = await Utils.createMobileAPI((...args) => Utils.handleApiResult(...args))
            }

            let styles = Utils.getStyles()
            Utils.applyStyles(styles); 
        }
        catch (err)
        {
            return initcback(err)
        }

        return initcback(null)
    }

    static getStyles () {
        if (BEAM && BEAM.style) {
            // TODO: проборосить стили из мобайла и экстеншена
            return BEAM.style
        }

        return {
            appsGradientOffset: -174,
            appsGradientTop: 56,
            content_main: "#ffffff",
            background_main_top: "#035b8f",
            background_main: "#042548",
            background_popup: "#00446c",
            validator_error: "#ff625c"
        }
    }

    static applyStyles(style) {
        if (!Utils.isDesktop()) {
            document.head.innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1" />';
        }

        if (Utils.isMobile()) {
            document.body.classList.add('mobile');
        }

        if (Utils.isWeb()) {
            document.body.classList.add('web');
        }
    }
    
    //
    // Convenience functions
    //
    static reload () {
        window.location.reload();
    }
    
    static async injectScript(url) {
        return new Promise((resolve, reject) => {
            let js = document.createElement('script');
            js.type = 'text/javascript';
            js.async = true;
            js.src = url;
            js.onload = () => resolve()
            js.onerror = (err) => reject(err)
            document.getElementsByTagName('head')[0].appendChild(js);
        })
    }

    static hex2rgba = (hex, alpha = 1) => {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    };

    static getById = (id)  => {
        return document.getElementById(id);
    }
    
    static setText(id, text) {
        Utils.getById(id).innerText = text;
    }

    static show(id) {
        Utils.getById(id).classList.remove("hidden");
    }
    
    static hide(id) {
        Utils.getById(id).classList.add("hidden");
    }

    static download(url, cback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let buffer    = xhr.response;
                    let byteArray = new Uint8Array(buffer);
                    let array     = Array.from(byteArray);

                    if (!array || !array.length) {
                        return cback("empty shader");
                    }
                
                    return cback(null, array);
                } else {
                    let errMsg = ["code", xhr.status].join(" ");
                    return cback(errMsg);
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
    }

    static handleString(next) {
        let result = true;
        const regex = new RegExp(/^-?\d+(\.\d*)?$/g);
        const floatValue = parseFloat(next);
        const afterDot = next.indexOf('.') > 0 ? next.substring(next.indexOf('.') + 1) : '0';
        if ((next && !String(next).match(regex)) ||
            (String(next).length > 1 && String(next)[0] === '0' && next.indexOf('.') < 0) ||
            (parseInt(afterDot, 10) === 0 && afterDot.length > 7) ||
            (afterDot.length > 8) ||
            (floatValue === 0 && next.length > 1 && next[1] !== '.') ||
            (floatValue < 1 && next.length > 10) ||
            (floatValue > 0 && (floatValue < MIN_AMOUNT || floatValue > MAX_AMOUNT))) {
          result = false;
        }
        return result;
    }

    static showWebLoading() {
        let styles = Utils.getStyles()
        Utils.applyStyles(styles);
        const topColor =  [styles.appsGradientOffset, "px,"].join('');
        const mainColor = [styles.appsGradientTop, "px,"].join('');

        let bg = document.createElement("div");
        bg.style.width = "100%";
        bg.style.height = "100%";
        bg.style.color = "#fff";
        bg.id = "dapp-loader";
        bg.style.position = "absolute";
        bg.style.backgroundImage = [
            "linear-gradient(to bottom,",
            styles.background_main_top, topColor,
            styles.background_main, mainColor,
            styles.background_main
        ].join(' ');
        let loadContainer = document.createElement("div");
        loadContainer.className = "dapp-loading";

        loadContainer.style.textAlign = 'center';
        loadContainer.style.margin = '50px auto 0 auto';
        loadContainer.style.width = '585px';
        loadContainer.style.padding = '5%';
        loadContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        loadContainer.style.borderRadius = '10px';

        let titleElem = document.createElement("h3");
        titleElem.innerText = "Connecting to BEAM Web Wallet."; 
        let subtitle = document.createElement("p");
        subtitle.innerText = "To use BEAM Gallery you should have BEAM Web Wallet installed and allow connection.";

        let reconnectButton = document.createElement("button");
        reconnectButton.innerText = "Try to connect again";
        reconnectButton.style.height = "44px";
        reconnectButton.style.padding = "13px 30px";
        reconnectButton.style.borderRadius = "50px";
        reconnectButton.style.border = "none";
        reconnectButton.style.color = "#fff";
        reconnectButton.style.cursor = "pointer";
        reconnectButton.style.fontWeight = "bold";
        reconnectButton.style.fontSize = "14px";
        reconnectButton.style.backgroundColor = "rgba(255, 255, 255, 0.1)";

        reconnectButton.addEventListener("mouseover", () => {
            reconnectButton.style.boxShadow = "0 0 8px white";
        }, false);
        reconnectButton.addEventListener("mouseout", () => {
            reconnectButton.style.boxShadow = "none";
        }, false);


        reconnectButton.addEventListener('click', () => {
            Utils.reload();
        });
        let installButton = document.createElement("button");
        installButton.innerText = "Install BEAM Web Wallet";
        installButton.style.height = "44px";
        installButton.style.padding = "13px 30px";
        installButton.style.borderRadius = "50px";
        installButton.style.border = "none";
        installButton.style.color = "#042548";
        installButton.style.cursor = "pointer";
        installButton.style.fontWeight = "bold";
        installButton.style.fontSize = "14px";
        installButton.style.backgroundColor = "#00f6d2";
        installButton.addEventListener('click', () => {
            window.open('https://chrome.google.com/webstore/detail/beam-web-wallet/ilhaljfiglknggcoegeknjghdgampffk', 
                '_blank');
        });

        installButton.addEventListener("mouseover", () => {
            installButton.style.boxShadow = "0 0 8px white";
        }, false);
        installButton.addEventListener("mouseout", () => {
            installButton.style.boxShadow = "none";
        }, false);
        installButton.style.marginLeft = '30px';
        
        let controlsArea = document.createElement("div");
        controlsArea.style.marginTop = "50px";
        
        loadContainer.appendChild(titleElem);
        loadContainer.appendChild(subtitle);
        loadContainer.appendChild(controlsArea);

        controlsArea.appendChild(reconnectButton);
        controlsArea.appendChild(installButton);

        bg.appendChild(loadContainer);

        document.body.appendChild(bg)
    }

    static hideWebLoading() {
        const elem = document.getElementById("dapp-loader");
        elem.parentNode.removeChild(elem);
    }

    static formateValue(value) {
        if (value > 0) {
            return parseFloat(value.toFixed(2)).toString();
        } else {
            return value;
        }
    }

    static numberWithCommas(x) {
        if (x > 0) {
            return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return x;
        }
    }

    static getRateStr(value, rate) {
        const rateVal = Utils.formateValue(new Big(value).times(rate));
        return (rate > 0 && value > 0
          ? (rateVal > 0.1 ? (Utils.numberWithCommas(rateVal) + ' USD') : '< 1 cent')
          : '0 USD');
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

    static isUserCancelled (err) {
        return err.error && err.error.code == -32021
    }

    static formatJSON(obj) {
        let res = JSON.stringify(obj, null, 2)
        return res == "{}" ? obj.toString() : res
    }
}
