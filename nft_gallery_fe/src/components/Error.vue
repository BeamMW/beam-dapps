<template>
  <div class="error">
    <div>
      <pre>{{ this.errorText }}</pre>
      <span class="restart">Restarting in {{ this.errleft }}</span>
    </div>
  </div>
</template>

<script>
import store from '../store';

export default {
  props: {
    error: {
      type: String,
      default: '',
    },
    context: {
      type: String,
      default: 'Error occured',
    },
  },

  data() {
    return {
      errleft: 0,
    };
  },

  mounted() {
    this.errleft = 5;
    this.timeout = setInterval(() => {
      this.errleft -= 1;
      if (this.errleft == 0) {
        clearInterval(this.timeout);
        this.$emit('clear-error');
      }
    }, 1000);
  },

  computed: {
    errorText() {
      // TODO: handle long errors
      if (store.state.error.code) {
        return [
          `CODE: ${store.state.error.code},\n DATA: ${store.state.error.data},\n MSG: ${store.state.error.message}`,
        ].join('\n');
      } else {
        return [store.state.error].join('');
      }
    },
  },
};
</script>
