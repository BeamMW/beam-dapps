import drawing from './components/nft-generator/app.js';
import utils from "./utils/utils.js";
drawing
const defaultState = () => {
  return {
    cid: "19bda81c54f0e578cffe31b369067ff3f4581f96f6d4c43cc61d43fb8a8d49e2",
    items: [],
    loading: true,
	artist_key: '',
	changed_txs: [],
	error: undefined,
  };
};

export const store = {
  state: Vue.reactive(defaultState()),
  getSeed() {
    const seedNum = Date.parse(new Date());
    utils.invokeContract(
      `role=user,action=generate,cid=${this.cid},seed=${seedNum}`,
      (...args) => this.onMakeTx(...args),
    );
  },
  LoadSeeds(err, res) {
    if (err) return this.$root.setError(err);
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
    if (err) return this.$root.setError(err);
    const mapedOwnerSeeds = seeds.map((seed) => seed.holder);
    const updated = items.map((seed) => ({
      ...seed,
      owned: mapedOwnerSeeds.includes(seed.holder),
    }));
    this.items = updated;
  },
  onMakeTx(err, sres, full, id) {
    if (err)
      return this.$root.setError(err, "Failed to generate transaction request");
    utils.ensureField(full.result, "raw_data", "array");
    console.log(full);
    utils.callApi("process_invoke_data",
      { data: full.result.raw_data },
      (err, res, full) => this.onSendToChain(err, res, full, id),
    );
  },
  onSendToChain(err, res, full, id) {
    if (err) {
      if (utils.isUserCancelled(err)) return;
      return this.$root.setError(err, "Failed to create transaction");
    }
  },
};
