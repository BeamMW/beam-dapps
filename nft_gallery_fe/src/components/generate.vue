<template>
  <a @click="onGetSeed" class="generate">GENERATE</a>
</template>

<script>
// import  store  from '../store/index.js';
// import { getSeed } from '../utils/beamAPI.js';

export default {
  methods: {
    onGetSeed() {
      console.log(1);
      this.$store.dispatch('GET_SEED');
    },
  },
};
</script>
