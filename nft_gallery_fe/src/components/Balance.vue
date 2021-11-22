<template>
  <button class="button">{{ balance }} BEAM</button>
</template>

<script>
import store from '../store';
import { parseToBeam } from '../utils/string-handlers';
export default {
  computed: {
    balance() {
      return parseToBeam(store.state.balance);
    },
  },
};
</script>

<style lang="scss">
.button {
  width: 114px;
  height: 40px;
  left: 43px;
  top: 375px;
  background: #1890ff;
  /* Primary/6 */

  border: 1px solid #1890ff;
  box-sizing: border-box;
  /* drop-shadow / button-primary */

  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
}
</style>
