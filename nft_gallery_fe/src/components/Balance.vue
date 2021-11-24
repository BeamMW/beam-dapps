<template>
  <popup
    v-if="isPopup"
    @closePopup="closePopup"
    @getMoney="getMoney"
    :popupTitle="this.popupTitle"
  >
    <span class="popupBalance">Your balance: {{ this.balance }} BEAM</span>
    <span class="popupDescription">Enter how much you want to withdraw</span>
    <input
      class="inputPopup"
      type="text"
      v-model="amount"
      :placeholder="this.balance"
    />
  </popup>
  <button class="button" @click="setMoney" :class="{ withdraw: this.balance }">
    {{ balance }} BEAM
  </button>
</template>

<script>
import store from '../store';
import { Beam } from '../utils/beamApi/beamAPI';
// import { Beam } from '../utils/beamApi/beamAPI';
import { parseToBeam } from '../utils/string-handlers';
import Popup from './popup/popup.vue';
export default {
  name: 'balance',
  emits: ['update:amount'],
  data() {
    return {
      isPopup: false,
      amount: '',
      popupTitle: 'WITHDRAW',
    };
  },
  components: {
    popup: Popup,
  },
  computed: {
    balance() {
      return parseToBeam(store.state.balance);
    },
  },
  methods: {
    setMoney() {
      this.isPopup = true;
    },
    closePopup() {
      this.isPopup = false;
    },
    getMoney() {
      Beam.withdrawMoney(this.amount);
      this.closePopup();
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
.withdraw {
  cursor: pointer;
}
.popupBalance {
  font-size: 30px;
  text-transform: uppercase;
}
.popupDescription {
  font-size: 18px;
  text-transform: uppercase;
}
.inputPopup {
  padding: 10px;
  width: 90%;
  border: none;
  border-collapse: none;
  border-radius: 10px;
  text-align: center;
}
</style>
