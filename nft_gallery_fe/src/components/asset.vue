<template>
  <div class="item">
    <div v-if="`${this.bytes}`" class="preview-container">
      <img :src="this.bytes" />
    </div>
    <div v-else class="preview-container">LOAD</div>
    <div class="info-row">
      <span class="small darker">{{ this.ownerText }}</span>
      <span
        class="small darker"
        :class="this.price && !this.in_tx ? '' : 'hidden'"
        >Price</span
      >
    </div>
    <div class="info-row">
      <span>
        <span v-if="!this.owned">
          <span class="dot red"></span>
          <span class="normal bolder">{{ this.holder }}</span>
        </span>
        <span v-else>
          <span class="dot green"></span>
          <span class="normal bolder">{{ this.holder }}</span>
        </span>
      </span>
      <span v-if="this.in_tx" class="small darker"
        >Transaction in progress</span
      >
      <span v-if="this.price && this.owned" class="normal bold"
        >{{ this.priceBeam }} BEAM</span
      >
      <span v-else-if="this.price && !this.owned">
        <a href="#" @click="this.onBuy" class="buy">BUY</a>
        <span class="normal bold ml-hem">{{ this.priceBeam }} BEAM</span>
      </span>
      <span v-else-if="this.owned">
        <a href="#" class="buy" @click="this.onSell">SELL</a>
      </span>
      <span v-else class="small darker">Not on sale</span>
    </div>
  </div>
</template>

<script>
// import  from '../utils/.js';
// import Loading from "./loading.js";
// import Dot from "./dot.js";
// import { parseToBeam } from "../utils/string-handlers.js";
// import  html  from 'vue';

import { parseToBeam } from '../utils/string-handlers';

export default {
  props: {
    seed: {
      type: Number,
      default: 0,
    },
    id: {
      type: Number,
      required: true,
    },
    holder: {
      type: String,
      default: '',
    },
    aid: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    bytes: {
      type: String,
      default: undefined,
    },
    in_tx: {
      type: Boolean,
      default: false,
    },
    owned: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  emits: ['buy', 'sell'],
  data() {
    return {
      priceBeam: parseToBeam(this.price),
    };
  },
  computed: {
    ownerText() {
      // if (this.artist) return this.artist
      if (this.owned) return 'You own this item';
      return 'Somebody';
    },
  },
  methods: {
    onBuy(ev) {
      ev.preventDefault();
      this.$emit('buy', this.id, this.seed);
    },

    onSell(ev) {
      ev.preventDefault();
      this.$emit('sell', this.seed);
    },
  },
};
</script>
