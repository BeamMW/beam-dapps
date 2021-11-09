import asset from './asset.js';
import { store } from '../store.js';
import loading from './loading.js';

export default {
  computed: {
    items() {
      return store.state.myItems
    },
    loading(){
      return store.state.loading
    }
  },

  components: {
    asset, loading
  },

  template: `
  <loading v-if="!items"></loading>
  <div v-else class="vertical-container">
            <div class="items">
                <asset v-for="item in items"
                v-bind:id="item.seed"
                v-bind:bytes="item.bytes"
                v-bind:owned="item.owned"
                v-bind:price="item.amount"
                v-bind:in_tx="item.in_tx"
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