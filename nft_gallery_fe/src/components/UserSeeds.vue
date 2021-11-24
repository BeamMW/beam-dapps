<template>
  <div class="vertical-container">
    <div class="items">
      <Item
        v-bind:key="item.id"
        v-for="item in items"
        v-bind:id="item.id"
        v-bind:seed="item.seed"
        v-bind:bytes="item.bytes"
        v-bind:owned="item.owned"
        v-bind:price="item.amount"
        v-bind:in_tx="item.in_tx"
        v-on:sell="onItem"
      />
    </div>
  </div>
</template>

<script>
import store from '../store/index.js';
import { Beam } from '../utils/beamApi/beamAPI.js';
import Item from './Item.vue';

export default {
  computed: {
    items() {
      return store.state.myItems;
    },
    in_tx() {
      return store.state.in_tx;
    },
  },
  components: { Item: Item },
  methods: {
    onItem(seed) {
      Beam.Item(seed);
    },
  },
};
</script>
