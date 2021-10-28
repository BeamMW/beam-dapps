import utils from '../utils/utils.js';
import upload from './upload.js';
import asset from './asset.js';
import drawing from './nft-generator/app.js';

export default {
  props: {
    changed_txs: {
      type: Array,
      default: [],
    },
    cid: {
      type: String,
      required: true,
    },
  },

  components: {
    asset,
    upload,
  },

  template: `
        <div class="vertical-container">
            <div class="items">
                <asset v-for="item in items"
                    v-bind:id="item.seed"
                    v-bind:bytes="item.bytes"
                    v-bind:owned="item.owned"
										v-bind:price="item.price"
                    v-bind:in_tx="item.in_tx"
                    v-on:buy="onBuyAsset"
                />
            </div>
        </div>    
    `,

  data() {
    return {
      items: [],
    };
  },

  watch: {
    changed_txs: {
      handler() {
        this.loadItems();
      },
    },
  },

  mounted() {
    utils.invokeContract(
      `role=manager,action=seeds,cid=${this.cid}`,
      (...args) => this.onLoadSeeds(...args)
    );
  },

  methods: {

    onLoadSeeds(err, res) {
      if (err) return this.$root.setError(err);
      const items = res.seeds.map(el => ({
        ...el,
        price: 1,
        owned: false,
        in_tx: false,
        bytes: drawing(el.seed)
      }));
      utils.invokeContract(
        `role=user,action=get_user_seeds,cid=${this.cid}`,
        (...args) => this.onLoadYourSeeds(items, ...args)
      );
    },

    onLoadYourSeeds(items, err, { seeds }) {
      if (err) return this.$root.setError(err);
      const mapedOwnerSeeds = seeds.map(seed => seed.holder);
      const updated = items.map(seed => ({
        ...seed,
        owned: mapedOwnerSeeds.includes(seed.holder),
      }));
      this.items = updated;
    },

    onBuyAsset(id) {
      utils.invokeContract(
        `role=user,action=buy,cid=${this.cid},seed=${id}, aid='5'`,
        (...args) => this.onMakeTx(...args)
      );
    },

    onSellAsset(id) {
      try {
        // TODO: show custom dialog and suport float values
        let price = prompt('Enter the price in BEAM');
        if (price == null) return;
        price = parseInt(price) * 100000000;

        utils.invokeContract(
          `role=user,action=set_price,id=${id},amount=${price},aid=0,cid=${this.cid}`,
          (err, sres, fres) => this.onMakeTx(err, sres, fres, id)
        );
      } catch (err) {
        this.$root.setError(err, 'Failed to sell an item');
      }
    },

    onMakeTx(err, sres, full, id) {
        if (err)
          return this.$root.setError(
            err,
            'Failed to generate transaction request'
          );
        utils.ensureField(full.result, 'raw_data', 'array');
        utils.callApi(
          'process_invoke_data',
          { data: full.result.raw_data },
        (err, res, full) => this.onSendToChain(err, res, full, id)
        );
      },

      onSendToChain(err, res, full, id) {
        if (err) {
          if (utils.isUserCancelled(err)) return;
          return this.$root.setError(err, 'Failed to create transaction');
        }
        for (let item of this.items) {
          if (item.id == id) {
            item.in_tx = true;
          }
        }
    },
  },
};
