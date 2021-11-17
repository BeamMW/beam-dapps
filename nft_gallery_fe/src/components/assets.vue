<template>
  <div class="vertical-container">
    <div class="items">
      <asset
        v-bind:key="item.id"
        v-for="item in items"
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
</template>

<script>
import store from '../store/index.js';
import Asset from './asset.vue';

export default {
  computed: {
    items() {
      console.log(store.state.items);
      return store.state.items;
    },
    in_tx() {
      return store.state.in_tx;
    },
  },
  components: { asset: Asset },
  methods: {
    onBuyAsset(id, seed) {
      this.dispatch.buyAsset(id, seed);
    },
    onSellAsset(seed, id) {
      this.dispatch.sellAsset(seed, id);
    },
  },
};
</script>
