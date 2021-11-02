import { store } from "../store.js";

export default {

  template: `
          <div class="generate">
          <button v-on:click='onGetSeed'> GENERATE </button>
          </div>    
      `,

  methods: {
    onGetSeed() {
      store.getSeed();
    },
  },
};
