import Utils from "./utils.js"

const TIMEOUT = 3000;
const REJECTED_CALL_ID = -32021;
const CONTRACT_ID = "a6dfab625af14d497c449fba559001912c9c0e9a0c2485f24b6e4fcd918ce0e9";

class TimeOracle {
    constructor() {
        this.timeout = undefined;
        this.pluginData = {
            contractId: CONTRACT_ID
        };
        this.parserInterval = undefined;
        this.time = undefined;
        this.contractTime = undefined;
        this.request = undefined;
    }

    setError = (errmsg) => {
        let errorElementId = "error-common";
        if (document.getElementById('time-oracle').classList.contains('hidden')) {
            errorElementId = "error-full";
            Utils.show('error-full-container');
        } else {
            Utils.show('error-common');
        }

        Utils.setText(errorElementId, errmsg)
        if (this.timeout) {
            clearTimeout(this.timeout);   
        }
        this.timeout = setTimeout(() => {
            Utils.setText(errorElementId, errmsg)
            this.start();
        }, TIMEOUT)
    }

    showOracle = () => {
        Utils.setText('cid', "Contract ID: " + CONTRACT_ID);
        Utils.show('time-oracle');
        Utils.hide('error-full-container');
        Utils.hide('error-common');
        Utils.show('parsed-time');
        Utils.show('contract-time');
    }

    setTime = (err, result) => {
    	if (err === null) {
            this.time = JSON.parse(result).unixtime;
            Utils.callApi("provider-set", "invoke_contract", {
                create_tx: false,
                args: ["role=sender,action=send,cid=", this.pluginData.contractId, ",aid=0,value=", this.time, ",caller_id=", this.request.caller_id,
                        ",caller_method=",this.request.caller_method].join("")
            });
            Utils.setText('parsed-time', ["Parsed time: ", parseFloat(this.time)].join(""));
        } else {
            Utils.setText('parsed-time', ["Error: ", err].join(""));
        }
    }

    start = () => {
        Utils.download("./oracleManager.wasm", (err, bytes) => {
            if (err) {
                let errTemplate = "Failed to load shader,"
                let errMsg = [errTemplate, err].join(" ")
                return this.setError(errMsg)
            }
    
            Utils.callApi("manager-view", "invoke_contract", {
                contract: bytes,
                create_tx: false,
                args: "role=manager,action=view"
            })
            Utils.callApi(1, "ev_subunsub", {
                "ev_system_state": true
            });
        });
        this.showOracle();
    }

    parseShaderResult = (apiResult) => {
        if (typeof(apiResult.output) != 'string') {
            throw "Empty shader response";
        }
    
        const shaderOut = JSON.parse(apiResult.output);
        if (shaderOut.error) {
            throw ["Shader error: ", shaderOut.error].join("")
        }
    
        return shaderOut;
    }

    onApiResult = (json) => {
        try {
            const apiAnswer = JSON.parse(json);
            if (apiAnswer.error) {
                if (apiAnswer.error.code == REJECTED_CALL_ID) {
                    return;
                }
                throw JSON.stringify(apiAnswer.error);
            }
    
            const apiCallId = apiAnswer.id;
            const apiResult = apiAnswer.result;
            if (!apiResult) {
                throw "Failed to call wallet API";
            }
    
            if (apiCallId == "manager-view") {
                const shaderOut = this.parseShaderResult(apiResult);
                if (shaderOut.contracts) {
                    for (var idx = 0; idx < shaderOut.contracts.length; ++idx) {
                        const cid = shaderOut.contracts[idx].cid
                        if (cid == CONTRACT_ID) {
                            this.pluginData.contractId = cid;
                        }
                    }
                }
                throw "Failed to verify contract id";
            }

            if (apiCallId == "request") {
                const shaderOut = this.parseShaderResult(apiResult)
                if (shaderOut.request) {
                    this.request = shaderOut.request;
                    Utils.fetch("http://worldtimeapi.org/api/timezone/Etc/GMT", this.setTime);
                }
            }

            if (apiCallId == "ev_system_state") {
                Utils.callApi("request", "invoke_contract", {
                    create_tx: false,
                    args: ["role=poller,action=check,cid=", this.pluginData.contractId].join("")
                });
            }
        } catch(err) {
            return this.setError(err.toString());
        }
    }
}

Utils.onLoad(async (beamAPI) => {
    let oracle = new TimeOracle();
    beamAPI.api.callWalletApiResult.connect(oracle.onApiResult);
    oracle.start();
});
