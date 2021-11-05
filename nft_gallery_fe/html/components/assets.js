import asset from './asset.js';
import { store } from '../store.js';

export default {
  computed: {
    items() {
      console.log(store.state.items);
      return store.state.items
    }
  },

  components: {
    asset,
  },

  template: `
  <div class="vertical-container">
            <div class="items">
                <asset v-for="item in items"
                    v-bind:id="item.id"
                    v-bind:seed="item.seed"
                    v-bind:bytes="item.bytes"
                    v-bind:owned="item.owned"
                    v-bind:price="item.amount"
                    v-bind:in_tx="item.in_tx"
                    v-on:buy="onBuyAsset"
                    v-on:sell="onSellAsset"
                />
            </div>
        </div>    
    `,

  methods: {
    onBuyAsset(id, seed) {
      console.log(id, seed)
     store.buyAsset(id, seed)
    },

    onSellAsset(seed, id) {   
     store.sellAsset(seed, id)
    },
}
}