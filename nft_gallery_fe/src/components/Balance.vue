<template>
  <popup
    v-if="isPopup"
    @closePopup="closePopup"
    @actionPopup="actionPopup"
    :popupTitle="this.popupTitle"
    :actionTitle="this.actionTitle"
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
import Popup from './popup/Popup.vue';
export default {
  name: 'balance',
  data() {
    return {
      isPopup: false,
      amount: parseToBeam(store.getters.BALANCE),
      popupTitle: 'WITHDRAW',
      actionTitle: 'GET MONEY',
    };
  },
  components: {
    popup: Popup,
  },
  computed: {
    balance() {
      return parseToBeam(store.getters.BALANCE);
    },
  },
  methods: {
    setMoney() {
      this.isPopup = true;
    },
    closePopup() {
      this.isPopup = false;
    },
    actionPopup() {
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
