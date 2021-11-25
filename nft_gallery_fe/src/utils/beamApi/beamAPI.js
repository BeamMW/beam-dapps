import Utils from '../utils';
// import { nextTick } from "vue";
import store from '../../store/index.js';
import { shader } from '../shader';
import drawing from '../nft-generator/app.js';
import { parseToGroth } from '../string-handlers';

export class Beam {
  static start = (err) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    Utils.invokeContract(
      'role=manager,action=view',
      (...args) => this.onCheckCID(...args),
      shader
    );
  };

  static onCheckCID = (err, res) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    if (!res.contracts.some((el) => el.cid == store.getters.CID)) {
      throw `CID not found '${store.getters.CID}'`;
    }
    Utils.invokeContract(
      `role=manager,action=seeds,cid=${store.getters.CID}`,
      (...args) => this.loadSeeds(...args)
    );
    this.loadPKey();
    this.loadBalance();
  };

  static getSeed = (err) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    const seedNum = Date.parse(new Date());
    Utils.invokeContract(
      `role=user,action=generate,cid=${store.getters.CID},seed=${seedNum}`,
      (...args) => this.makeTx(...args)
    );
  };

  //   load all seeds
  static loadSeeds = (err, res) => {
    if (err) return store.dispatch('GET_ERR', err.error);
    const items = res.seeds.map((el, idx) => ({
      ...el,
      id: idx,
      price: el.amount,
      owned: false,
      in_tx: false,
      bytes: drawing(el.seed),
    }));
    Utils.invokeContract(
      `role=user,action=get_user_seeds,cid=${store.state.cid}`,
      (...args) => this.loadYourSeeds(items, ...args)
    );
    store.dispatch('GET_ITEMS', items);
  };
  // load your seeds & update seed owned

  static loadYourSeeds = (items, err, { seeds }) => {
    if (err) return store.dispatch('GET_ERR', err.error);
    const mapedOwnerSeeds = seeds.map((seed) => seed.holder);
    const updated = items.map((seed) => ({
      ...seed,
      owned: mapedOwnerSeeds.includes(seed.holder),
    }));
    const UserSeeds = seeds.map((el, idx) => ({
      ...el,
      id: idx,
      price: el.amount,
      owned: true,
      in_tx: false,
      bytes: drawing(el.seed),
    }));

    store.state.myItems = UserSeeds;
    store.dispatch('GET_ITEMS', updated);
    this.changeLoading();
  };

  //   transaction

  static makeTx = (err, sres, full, store) => {
    console.log(err, sres, full, store);
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    console.log('make');
    Utils.ensureField(full.result, 'raw_data', 'array');
    Utils.callApi(
      'process_invoke_data',
      { data: full.result.raw_data },
      (...args) => this.onSendToChain(...args)
    );
  };

  static onSendToChain = (err, res) => {
    if (err) {
      if (Utils.isUserCancelled(err)) return;
      return this.$store.dispatch('GET_ERR', err.error);
    }
    Utils.ensureField(res, 'txid', 'string');
    Utils.callApi(
      'tx_status',
      {
        txId: res.txid,
      },
      (...args) => this.checkStatus(...args)
    );
  };

  static checkStatus = (err, full) => {
    // console.log(full.status_string);
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    if (full.status_string === 'in progress') {
      setTimeout(() => {
        Utils.callApi(
          'tx_status',
          {
            txId: full.txId,
          },
          (...args) => this.checkStatus(...args)
        );
      }, 5000);
    } else if (full.status_string === 'completed') {
      console.log(full.status_string);
      Utils.invokeContract(
        `role=manager,action=seeds,cid=${store.getters.CID}`,
        (...args) => this.loadSeeds(...args)
      );
    }
  };
  //  Buy & sell seeds

  static buyItem = (id, seed, err) => {
    if (err) {
      console.log(err);
      return store.dispatch('GET_ERR', err.error);
    }
    Utils.invokeContract(
      `role=user,action=buy,cid=${store.state.cid},seed=${seed},price=${store.state.items[id].amount}`,
      (...args) => this.makeTx(...args)
    );
  };

  static sellItem = (seed, price, err) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    Utils.invokeContract(
      `role=user,action=set_price,cid=${store.state.cid},aid=0,seed=${seed},price=${parseToGroth(price)}`,
      (...args) => this.makeTx(...args)
    );
  };

  static changeLoading = (err) => {
    if (err) {
      return store.dispatch('GET_ERR', err);
    }
    store.state.loading = false;
  };

  static loadBalance = (err) => {
    if (err) {
      return store.dispatch('GET_ERR', err);
    }
    Utils.invokeContract(
      `role=user,action=balance,cid=${store.getters.CID},aid=0`,
      (...args) => this.setBalance(...args),
      console.log(store.state.balance)
    );
  };

  static setBalance = (err, res) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    return store.dispatch('GET_BALANCE', res.balance);
  };

  static loadPKey = (err) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    Utils.invokeContract(
      `role=user,action=get_key,cid=${store.getters.CID},aid=0`,
      (...args) => this.setPkey(...args),
      console.log(store.state.balance)
    );
  };

  static setPkey = (err, res) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    return store.dispatch('GET_P_KEY', res.key);
  };

  static withdrawMoney = (amount, err ) => {
    if (err) {
      return store.dispatch('GET_ERR', err.error);
    }
    Utils.invokeContract(
      `role=user,action=withdraw,cid=${store.getters.CID},amount=${parseToGroth(amount)}aid=0`,
      (...args) => this.makeTx(...args)
    );
  };
}
