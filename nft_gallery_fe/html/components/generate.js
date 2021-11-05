import { store } from "../store.js";

export default {

  template: `
          <a v-on:click='onGetSeed' class='generate'>GENERATE</a>  
      `,

  methods: {
    onGetSeed() {
      store.getSeed();
    },
  },
};

