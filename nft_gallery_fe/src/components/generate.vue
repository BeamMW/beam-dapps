<template>
  <a @click="onGetSeed" class="generate">GENERATE</a>
</template>

<script>
// import  store  from '../store/index.js';
// import { getSeed } from '../utils/beamAPI.js';

import { Beam } from '../utils/beamApi/beamAPI';

export default {
  methods: {
    onGetSeed() {
      console.log(1);
      Beam.getSeed();
    },
  },
};
</script>
