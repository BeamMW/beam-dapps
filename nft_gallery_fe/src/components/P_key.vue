<template>
  <popup
    v-if="isPopup"
    @closePopup="closePopup"
    @actionPopup="copyPkey"
    :popupTitle="this.popupTitle"
    :actionTitle="this.actionTitle"
    >{{ pkey }}</popup
  >
  <button class="button" @click="viewPKey">Public key</button>
</template>

<script>
import store from '../store';
import Popup from './popup/popup.vue';

export default {
  name: 'p_key',
  data() {
    return {
      isPopup: false,
      popupTitle: 'Public KEY',
      actionTitle: 'COPY',
    };
  },
  components: {
    popup: Popup,
  },
  computed: {
    pkey() {
      return store.state.p_key;
    },
  },
  methods: {
    viewPKey() {
      console.log(1);
      this.isPopup = true;
    },
    copyPkey() {
      this.closePopup();
    },
    closePopup() {
      this.isPopup = false;
    },
  },
};
</script>
