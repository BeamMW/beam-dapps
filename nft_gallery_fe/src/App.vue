<template>
  <error
    v-if="error"
    v-bind:error="error.error"
    v-bind:context="error.context"
  ></error>
  <loading v-else-if="loading"></loading>
  <div v-else class="app">
    <div class="nav-container">
      <div class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/userpics">UserSeeds</router-link>
        <generate></generate>
      </div>
      <div class="userInfo">
        <balance></balance>
        <pkey></pkey>
      </div>
    </div>
  </div>
  <notification
  v-if="isNotification"
  />
  <router-view>
  </router-view>
</template>

<script>
import Generate from '@/components/Generate.vue';
import Loading from '@/components/loading.vue';
import ErrView from '@/components/Error.vue';
import Balance from '@/components/Balance.vue';
import Pkey from '@/components/P_key.vue';
import Notification from "@/components/popup/Notification";
import store from "@/store";

export default {
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    error() {
      return this.$store.state.error;
    },
    isNotification() {
      return store.getters.POPUP_TX;
    },
    tx_title() {
      return store.getters.IN_TX;
    },
    tx_action() {
      return store.getters.ACTION_TX;
    },
  },

  components: {
    generate: Generate,
    loading: Loading,
    error: ErrView,
    balance: Balance,
    pkey: Pkey,
    notification: Notification
  },
};
</script>

<style lang="scss">
/* common start */

html,
body {
  font-family: 'SFProDisplay', sans-serif;
  font-weight: normal;
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  color: white;
}
na .error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  word-break: break-word;
  color: red;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  word-break: break-word;
}

pre {
  font-family: 'SFProDisplay', sans-serif;
  font-weight: normal;
  white-space: pre-wrap;
}

.upload {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.app {
  width: 100%;
  height: 97%;
  display: contents;
}

.nav-container {
  display: flex;
  margin-top: 30px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-around;
}
.nav {
  display: flex;
  flex-direction: row;
  width: 355px;
  justify-content: space-evenly;
  color: green;
  align-items: center;
}
.userInfo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.withdraw {
  margin-right: 10px;
}
.generate {
  padding: 14px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #00f6d2;
  margin-left: 10px;
}
.generate:hover {
  color: rgb(3, 27, 78);
  background-color: #00f6d2;
  font-size: 16px;

  transition: cubic-bezier(0.23, 1, 0.32, 1);
}

.vertical-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 87%;
}

.web .vertical-container {
  height: 85%;
}

.items {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  flex-grow: 1;
  justify-content: center;
}

.items > .item {
  margin-left: 16px;
  margin-bottom: 16px;

  display: flex;
  flex-direction: column;
  width: 350px;
  height: 445px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.item .preview-container {
  height: 350px;
  margin-bottom: 18px;
  margin-top: 20px;
  margin-left: 18px;
  margin-right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 5px;
}

.item > .info-row {
  box-sizing: border-box;
  padding-left: 18px;
  padding-right: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin-bottom: 3px; */
}

::-webkit-scrollbar {
  width: 11px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  border: 3px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-button {
  display: none;
}

.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.green {
  background-color: limegreen;
}

.red {
  background-color: crimson;
}

.darker {
  opacity: 0.5;
}

.small {
  font-size: 0.85em;
}

.normal {
  font-size: 0.9em;
  opacity: 0.9;
}

.bolder {
  font-weight: 500;
}

.bold {
  font-weight: 600;
}

.hidden {
  display: none;
}

a {
  color: limegreen;
  text-decoration: none;
}

.buy {
  color: limegreen;
  border: 1px solid limegreen;
  border-radius: 3px;
  padding-left: 4px;
  padding-right: 4px;
  font-size: 0.78em;
}

.ml-hem {
  margin-left: 0.5em;
}
</style>
