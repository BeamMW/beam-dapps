import drawing from './components/nft-generator/app.js';
import { router } from './router.js';
import utils from "./utils/utils.js";

drawing
const defaultState = () => {
  return {
    cid: "19bda81c54f0e578cffe31b369067ff3f4581f96f6d4c43cc61d43fb8a8d49e2",
    items: [],
    loading: false,
	artist_key: '',
	changed_txs: [],
	error: undefined,
  };
};

export const store = {
  state: Vue.reactive(defaultState()),

  setError(error, context) {
    this.state.error = {error, context}
    router.push({name: 'assets'})
},

checkError (err) {
    if (err) this.setError(err)
},

clearError() {
    this.state.error = undefined
    this.start()
},

  start () {
    if (this.state.refresh_timer) {
        clearInterval(this.state.refresh_timer)
    }

    Object.assign(this.state, defaultState())
    router.push({name: 'assets'})

    Vue.nextTick(() => {
        utils.download("./app.wasm", (err, bytes) => {
            if (err) return this.setError(err, "Failed to download shader")
            this.state.shader = bytes

            //utils.invokeContract("", (...args) => this.onShowMethods(...args), this.state.shader)
            //utils.callApi("ev_subunsub", {ev_txs_changed: true, ev_system_state: true}, (err) => this.checkError(err))
            // this.state.refresh_timer = setInterval(() => this.refreshAllData(), 10000)
                utils.invokeContract(
                'role=manager,action=view',
                (...args) => this.onCheckCID(...args),this.state.shader
            );
        })
    })
},
onCheckCID (err, res) {
    if (err) {
        return this.setError(err, "Failed to verify cid")     
    }

    if (!res.contracts.some(el => el.cid == this.state.cid)) {
        throw `CID not found '${this.state.cid}'`
    }

    utils.invokeContract(
        `role=manager,action=seeds,cid=${this.state.cid}`,
        (...args) => this.LoadSeeds(...args)
      );
},

   onShowMethods (err, res) {
    if (err) return this.setError(err)
    alert(utils.formatJSON(res))
},
onApiResult(err, res, full) {
    if (err) {
        console.log(err, res, full);
        return this.setError(err, 'API handling error');
    }

    if (full.id == 'ev_txs_changed') {
        let txs = full.result.txs;
        let changed = [];

        for (let tx of txs) {
            if (tx.status == 2 || tx.status == 3 || tx.status == 4) {
                changed.push(tx.txId);
            }
        }

        return;
    }
    if (full.id == 'ev_system_state') {
        // we update our data on each block
        this.refreshAllData()
        return
    }

    this.setError(full, 'Unexpected API result');
},

checkError(err) {
    if (err) return this.setError(err);
},


  getSeed() {
    const seedNum = Date.parse(new Date());
    utils.invokeContract(
      `role=user,action=generate,cid=${this.state.cid},seed=${seedNum}`,
      (...args) => this.makeTx(...args),
    );
  },
  LoadSeeds(err, res) {
    if (err) return this.setError(err);
    const items = res.seeds.map((el) => ({
      ...el,
      price: 1,
      owned: false,
      in_tx: false,
      bytes: drawing(el.seed),
    }));
    utils.invokeContract(
      `role=user,action=get_user_seeds,cid=${this.state.cid}`,
      (...args) => this.LoadYourSeeds(items, ...args),
    );
  },

  LoadYourSeeds(items, err, { seeds }) {
    if (err) return this.setError(err);
    const mapedOwnerSeeds = seeds.map((seed) => seed.holder);
    const updated = items.map((seed) => ({
      ...seed,
      owned: mapedOwnerSeeds.includes(seed.holder),
    }));
    this.state.items = updated;
    console.log(this.state.items) 
  },
  makeTx(err, sres, full, id) {
    if (err)
      return this.setError(err, "Failed to generate transaction request");
    utils.ensureField(full.result, "raw_data", "array");
    console.log(full);
    utils.callApi("process_invoke_data",
      { data: full.result.raw_data },
      (err, res, full) => this.sendToChain(err, res, full, id),
    );
  },
  sendToChain(err, res, full, id) {
    if (err) {
      if (utils.isUserCancelled(err)) return;
      return this.setError(err, "Failed to create transaction");
    }
  },
};
