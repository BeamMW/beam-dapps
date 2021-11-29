/* eslint-disable no-unused-vars */
import { createStore } from 'vuex';
import Utils from '../utils/utils';
import { nextTick } from 'vue';

export default createStore({
  state: {
    cid: '1c168d0ff0de97163c4075a3b8a2ffacc3bce2510447b41113aad3cd77697c5f',
    items: [],
    loading: true,
    p_key: '',
    changed_txs: [],
    error: undefined,
    myItems: [],
    in_tx: 'in process',
    popup_tx: false,
    action_tx:'',
    shader: [],
    balance: undefined,
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
    BALANCE: (state) => {
      return state.balance;
    },
    P_KEY: (state) => {
      return state.p_key;
    },
    IN_TX: (state) => {
      return state.in_tx;
    },
    POPUP_TX: (state) => {
      return state.popup_tx;
    },
    ACTION_TX: (state) => {
      return state.action_tx;
    },
  },
  mutations: {
    SET_SHADER: (state, payload) => {
      state.shader = payload;
    },
    SET_ERR: (state, payload) => {
      console.log(payload);
      state.error = payload;
    },
    SET_ITEMS: (state, payload) => {
      state.items = payload;
    },
    SET_BALANCE: (state, payload) => {
      state.balance = payload;
    },
    SET_P_KEY: (state, payload) => {
      state.p_key = payload;
    },
    SET_IN_TX: (state, payload) => {
      state.in_tx = payload;
    },
    SET_POPUP_TX: (state, payload) => {
      state.popup_tx = payload;
    },
    SET_ACTION_TX: (state, payload) => {
      state.action_tx = payload;
    },
  },
  actions: {
    GET_SHADER: (context, payload) => {},
    GET_ITEMS: (context, payload) => {
      context.commit('SET_ITEMS', payload);
    },

    GET_ERR: (context, payload) => {
      context.commit('SET_ERR', payload);
    },
    GET_BALANCE: (context, payload) => {
      context.commit('SET_BALANCE', payload);
    },
    GET_P_KEY: (context, payload) => {
      context.commit('SET_P_KEY', payload);
    },
    GET_IN_TX: (context, payload) => {
      context.commit('SET_IN_TX', payload);
    },

    GET_POPUP_TX: (context, payload) => {
      context.commit('SET_POPUP_TX', payload);
    },
    GET_ACTION_TX: (context, payload) => {
      context.commit('SET_ACTION_TX', payload);
    },

    GET_APIRESULT: (store, err, res, full) => {
      console.log(res, full, err);
      if (err) {
        console.log(err.error);
        return store.dispatch('GET_ERR', err.error);
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
