/* eslint-disable no-unused-vars */
import { createStore } from 'vuex';
import Utils from '../utils/utils';
import drawing from '../utils/nft-generator/app';
import { parseToGroth } from '../utils/string-handlers';
import { nextTick } from 'vue';

export default createStore({
  state: {
    cid: '1c168d0ff0de97163c4075a3b8a2ffacc3bce2510447b41113aad3cd77697c5f',
    items: [],
    loading: true,
    artist_key: '',
    changed_txs: [],
    error: undefined,
    myItems: [],
    in_tx: true,
    shader: undefined,
  },
  getters: {
    SHADER: (state) => {
      return state.shader;
    },
    CID: (state) => {
      return state.cid;
    },
    ERR: (state) => {
      return state.error;
    },
    ITEMS: (state) => {
      return state.items;
    },
  },
  mutations: {
    SET_SHADER: (state, payload) => {
      state.shader = payload;
    },
    SET_ERR: (state, payload) => {
      state.error = payload;
    },
    SET_ITEMS: (state, payload) => {
      state.items = payload;
    },
  },
  actions: {
    GET_SHADER: (context, payload) => {
      nextTick(() => {
        Utils.download('../utils/app.wasm', (err, bytes) => {
          if (err) return this.setError(err, 'Failed to download shader');
          payload = Array.from(new Uint8Array(bytes));
          console.log(payload);
          context.commit('SET_SHADER', payload);
        });
      });
    },
    GET_ITEMS: (context, payload) => {
      context.commit('SET_ITEMS', payload);
    },

    GET_SEED: (store) => {
      console.log(2);
      const seedNum = Date.parse(new Date());
      Utils.invokeContract(
        `role=user,action=generate,cid=${store.state.cid},seed=${seedNum}`,
        (...args) => makeTx(...args)
      );
    },

    // makeTx: (err, sres, full, store) => {
    //   console.log(err, sres, full, store);
    //   if (err) {
    //     return store.dispatch('GET_ERR', err);
    //   }
    //   console.log('make');
    //   Utils.ensureField(full.result, 'raw_data', 'array');
    //   Utils.callApi(
    //     'process_invoke_data',
    //     { data: full.result.raw_data },
    //     (...args) => store.dispatch('sendToChain', ...args)
    //   );
    // },

    GET_InfoTx: (err, full, store) => {
      if (err) {
        return store.dispatch('GET_ERR', err);
      }
    },

    sendToChain: (err, res, store) => {
      if (err) {
        if (Utils.isUserCancelled(err)) return;
        return store.dispatch('GET_ERR', err);
      }
      Utils.ensureField(res, 'txid', 'string');
      Utils.callApi(
        'tx_status',
        {
          txId: res.txid,
        },
        (...args) => store.dispatch('checkStatus', ...args)
      );
    },

    checkStatus: (err, full, store) => {
      // console.log(full.status_string);
      if (err) {
        return store.dispatch('SET_ERR', err);
      }
      if (full.status_string === 'in progress') {
        setTimeout(() => {
          Utils.callApi(
            'tx_status',
            {
              txId: full.txId,
            },
            (...args) => store.dispatch('checkStatus', ...args)
          );
        }, 5000);
      } else if (full.status_string === 'completed') {
        console.log(full.status_string);
        // Utils.invokeContract(
        //   `role=manager,action=seeds,cid=${store.state.cid}`,
        //   (...args) => LoadSeeds(...args)
        // );
      }
    },

    GET_ERR: (context, payload) => {
      context.commit('SET_ERR', payload);
    },
    GET_APIRESULT: (err, res, full) => {
      console.log(res, full, err);
      if (err) {
        return this.setError(err, 'API handling error');
      }

      // if (full.id == 'ev_txs_changed') {
      //     let txs = full.result.txs;
      //     let changed = [];

      //     for (let tx of txs) {
      //         if (tx.status == 2 || tx.status == 3 || tx.status == 4) {
      //             changed.push(tx.txId);
      //             console.log(tx.txId);
      //         }
      //     }

      //     return;
      // }
      if (full.id == 'ev_system_state') {
        console.log(err, res, full.id);
        // we update our data on each block
        this.LoadSeeds();
        return;
      }
      // if(full.id == 'tx_status'){
      //   for (let tx of txs) {
      //     if (tx.status == 2 || tx.status == 3 || tx.status == 4) {
      //         changed.push(tx.txId);
      //         console.log(changed);
      //     }
      // }

      // return;
      // }

      this.setError(full, 'Unexpected API result');
    },
  },
  modules: {},
});

const makeTx = (err, sres, full, store) => {
  console.log(err, sres, full, store);
  if (err) {
    return store.dispatch('GET_ERR', err);
  }
  console.log('make');
  Utils.ensureField(full.result, 'raw_data', 'array');
  Utils.callApi(
    'process_invoke_data',
    { data: full.result.raw_data },
    (...args) => onSendToChain(...args)
  );
};

const getInfoTx = (err, full) => {
  if (err) {
    return this.$store.dispatch('GET_ERR', err);
  }
};

const onSendToChain = (err, res) => {
  if (err) {
    if (Utils.isUserCancelled(err)) return;
    return this.$store.dispatch('GET_ERR', err);
  }
  Utils.ensureField(res, 'txid', 'string');
  Utils.callApi(
    'tx_status',
    {
      txId: res.txid,
    },
    (...args) => checkStatus(...args)
  );
};

const checkStatus = (err, full) => {
  // console.log(full.status_string);
  if (err) {
    console.log(err);
  }
  if (full.status_string === 'in progress') {
    setTimeout(() => {
      Utils.callApi(
        'tx_status',
        {
          txId: full.txId,
        },
        (...args) => checkStatus(...args)
      );
    }, 5000);
  } else if (full.status_string === 'completed') {
    console.log(full.status_string);
    // Utils.invokeContract(
    //   `role=manager,action=seeds,cid=${store.state.cid}`,
    //   (...args) => LoadSeeds(...args)
    // );
  }
};
