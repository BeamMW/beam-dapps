import drawing from './components/nft-generator/app.js';
import { router } from './router.js';
import { parseToGroth } from './utils/string-handlers.js';
import utils from "./utils/utils.js";

const defaultState = () => {
  return {
    cid: "1c168d0ff0de97163c4075a3b8a2ffacc3bce2510447b41113aad3cd77697c5f",
    items: [],
    loading: false,
	artist_key: '',
	changed_txs: [],
	error: undefined,
    myItems:[]
  };
};
export const store = {
    state: Vue.reactive(defaultState()),
    
    //  Error
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

// start & check shader cid

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

// onShowMethods (err, res) {
//     if (err) return this.setError(err)
//     alert(utils.formatJSON(res))
// },

onApiResult(err, res, full) {
    if (err) {
        return this.setError(err, 'API handling error');
    }

    if (full.id == 'ev_txs_changed') {
        let txs = full.result.txs;
        let changed = [];

        for (let tx of txs) {
            if (tx.status == 2 || tx.status == 3 || tx.status == 4) {
                changed.push(tx.txId);
        console.log(err, res, full.id);
        console.log(tx, txs);
            }
        }

        return;
    }
    if (full.id == 'ev_system_state') {
        console.log(err, res, full.id);
        // we update our data on each block
        this.refreshAllData()
        return
    }
    if(full.id == 'tx_status'){
        console.log('status')
    }

    this.setError(full, 'Unexpected API result');
},

checkError(err) {
    if (err) return this.setError(err);
},

//  Generate new seed
  getSeed() {
    const seedNum = Date.parse(new Date());
    utils.invokeContract(
      `role=user,action=generate,cid=${this.state.cid},seed=${seedNum}`,
      (...args) => this.makeTx(...args),
    );
  },


//   load all seeds
  LoadSeeds(err, res) {
    if (err) return this.setError(err);
    const items = res.seeds.map((el, idx) => ({
      ...el,
      id: idx,
      price: el.amount,
      owned: false,
      in_tx: false,
      bytes: drawing(el.seed),
    }));
    utils.invokeContract(
      `role=user,action=get_user_seeds,cid=${this.state.cid}`,
      (...args) => this.LoadYourSeeds(items, ...args),
    );
    this.state.items = items;

  },

// load your seeds & update seed owned

  LoadYourSeeds(items, err, { seeds }) {
      console.log(seeds);
    if (err) return this.setError(err);
    const mapedOwnerSeeds = seeds.map((seed) => seed.holder);
    const updated = items.map((seed) => ({
      ...seed,
      owned: mapedOwnerSeeds.includes(seed.holder),
    }));
    const mySeeds = seeds.map((el, idx) => ({
        ...el,
        id: idx,
        price: el.amount,
        owned: true,
        in_tx: false,
        bytes: drawing(el.seed),
      }));
      
    this.state.myItems = mySeeds;
    this.state.items = updated;
    console.log(this.items) 
  },


//   transaction

makeTx (err, sres, full) {
    if (err) {
        return this.setError(err, "Failed to generate transaction request")
    }

    utils.ensureField(full.result, "raw_data", "array")
    utils.callApi(
        'process_invoke_data', {data: full.result.raw_data}, 
        (...args) => this.onSendToChain(...args)
    )
},

onSendToChain(err, res) {
    if (err) {
        if (utils.isUserCancelled(err)) return
        return this.setError(err, "Failed to create transaction")
    }
    utils.ensureField(res, "txid", "string")
},

//   reload() {
//       utils.invokeContract(
//           `role=manager,action=seeds,cid=${this.state.cid}`,
//           (...args) => this.LoadSeeds(...args)
//         )
// },

//   viewTxStatus(txId) {
//     utils.callApi("tx_status",{
//         txId
//       }, 
//       () => reload()
//   );
//     },


//  Buy & sell seeds

  buyAsset(id, seed) {
    utils.invokeContract(
      `role=user,action=buy,cid=${store.state.cid},seed=${seed},price=${store.state.items[id].amount}`,
      (...args) => this.makeTx(...args)
    );
  },
      sellAsset(seed, id) {
        let price = prompt('Enter the price in BEAM');
        if (price == null) return;
        price = parseToGroth(price);
    utils.invokeContract(
          `role=user,action=set_price,cid=${store.state.cid},aid=0,seed=${seed},price=${price}`,
          (...args) => this.makeTx(...args)
        );
    },
}