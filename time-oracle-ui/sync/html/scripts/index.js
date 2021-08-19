import Utils from "./utils.js"

const TIMEOUT = 3000;
const GROTHS_IN_BEAM = 100000000;
const REJECTED_CALL_ID = -32021;
const IN_PROGRESS_ID = 5;
const CONTRACT_ID = "bb9a613ac40185b07bddddc3bb15d7c9c78d753989f1834b46e206c190e0de21";

class TimOracle {
    constructor() {
        this.timeout = undefined;
        this.pluginData = {
            contractId: undefined,
            balance: 0,
            inProgress: false,
            isWithdraw: null
        };
        this.parserTimeout = undefined;
        this.time = undefined;
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
        Utils.setText('cid', "Contract ID: " + this.pluginData.contractId);
        Utils.setText('in-time-oracle', parseFloat(new Big(this.pluginData.balance).div(GROTHS_IN_BEAM)));
        Utils.show('time-oracle');
        Utils.hide('error-full-container');
        Utils.hide('error-common');
        Utils.show('time');
        this.refresh(false);
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
        })
    }
    
    refresh = (now) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            Utils.callApi("user-view", "invoke_contract", {
                create_tx: false,
                args: ["role=client,action=get,cid=", this.pluginData.contractId, ",aid=0"].join("")
            })
        }, now ? 0 : TIMEOUT);
        this.parserTimeout = setTimeout(() => {
            Utils.fetch("https://time.is/GMT", function(err, result) {
                if (err === null) {
                    let start_index = result.search("<time"); 
                    let end_index = result.search("</time>"); 
                    this.time = buffer.substring(start_index + 17, end_index);
                    Utils.callApi("provider-set", "invoke_contract", {
                        create_tx: false,
                        args: ["role=sender,action=send,cid=", this.pluginData.contractId, ",aid=0,value=", this.time].join("")
                    });
                }
            });
        }, 1000);
        
        if (this.time !== undefined) {
            Utils.setText('time', parseFloat(this.time));
        }
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
                window.alert(shaderOut.contracts)
                if (shaderOut.contracts) {
                    for (var idx = 0; idx < shaderOut.contracts.length; ++idx) {
                        const cid = shaderOut.contracts[idx].cid
                        if (cid == CONTRACT_ID) {
                            this.pluginData.contractId = cid;
                            return this.refresh(true);
                        }
                    }
                }
                throw "Failed to verify contract id";
            }
    
            if (apiCallId == "user-view") {
                const shaderOut = this.parseShaderResult(apiResult)
                if (!shaderOut.Value) {
                    throw "No values";
                }
                
                this.time = shaderOut.Value;

                Utils.callApi("tx-list", "tx_list", {});
                return this.refresh(false);
            }
    
            if (apiCallId == "tx-list") {
                if (!Array.isArray(apiResult)) {
                    throw "Failed to get transactions list";
                }
                
                this.pluginData.inProgress = false;
                this.pluginData.isWithdraw = null;

                for (let element of apiResult) {
                    if (element["tx_type_string"] == "contract") {
                        const ivdata = element["invoke_data"];
                        let isProgressDetected = false;
                        for (let data of ivdata) {
                            if (data["contract_id"] == this.pluginData.contractId) {
                                const status = element["status"]
                                if (status === IN_PROGRESS_ID) {
                                    isProgressDetected = true;
                                    break;
                                }
                            }
                        };

                        if (isProgressDetected) {
                            this.pluginData.inProgress = true;
                            this.pluginData.isWithdraw = element["comment"] === "withdraw from Vault"; 
                            break;
                        }
                    }
                };
                return this.showOracle();
            }
    
            if (apiCallId == "process_invoke_data") {
                return this.refresh(true);
            }
        } catch(err) {
            return this.setError(err.toString());
        }
    }
}

Utils.onLoad(async (beamAPI) => {
    let oracle = new TimOracle();
    beamAPI.api.callWalletApiResult.connect(oracle.onApiResult);
    oracle.start();
});
