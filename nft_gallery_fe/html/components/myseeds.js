import asset from './asset.js';
import { store } from '../store.js';

export default {
  computed: {
    items() {
      console.log(store.state.myItems);
      return store.state.myItems
    }
  },

  components: {
    asset,
  },

  template: `
  <div class="vertical-container">
            <div class="items">
                <asset v-for="item in items"
                v-bind:id="item.seed"
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
    
        onSellAsset(seed) {
         store.sellAsset(seed)
        },
    }
}