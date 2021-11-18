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
        v-on:sell="onSellAsset"
      />
    </div>
  </div>
</template>

<script>
import store from '../store/index.js';
import { Beam } from '../utils/beamApi/beamAPI.js';
import Asset from './asset.vue';

export default {
  computed: {
    items() {
      return store.state.myItems;
    },
    in_tx() {
      return store.state.in_tx;
    },
  },
  components: { asset: Asset },
  methods: {
    onSellAsset(seed) {
      Beam.sellAsset(seed);
    },
  },
};
</script>
