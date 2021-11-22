<template>
  <span>P_key: {{ pkey }}</span>
</template>

<script>
import store from '../store';
export default {
  computed: {
    pkey() {
      return store.state.p_key;
    },
  },
};
</script>

