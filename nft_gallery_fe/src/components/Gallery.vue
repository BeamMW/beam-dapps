<template>
  <div class="vertical-container">
    <div class="items">
      <item
        v-bind:key="item.id"
        v-for="item in items"
        v-bind:id="item.id"
        v-bind:seed="item.seed"
        v-bind:bytes="item.bytes"
        v-bind:owned="item.owned"
        v-bind:price="item.amount"
        v-bind:in_tx="item.in_tx"
        v-on:buy="onBuyItem"
        v-on:sell="onSellItem"
      />
    </div>
  </div>
</template>

<script>
import store from '../store/index.js';
import { Beam } from '../utils/beamApi/beamAPI.js';
import Item from './Item.vue';
export default {
  name: 'gallery',
  computed: {
    items() {
      console.log(store.state.items);
      return store.state.items;
    },
  },
  components: { item: Item, },
  methods: {
    onBuyItem(id, seed) {
      console.log('buy');
      Beam.buyItem(id, seed);
    },
    onSellItem(seed) {
      console.log('sell');
      Beam.sellItem(seed);
    },
  },
};
</script>
