<template>
  <div class="notification">
    <div class="notification_content" :class="notification_title === 'completed' ? 'green' : '' ">
      <div class="notification_content-header">
        <div class="title">{{ notification_title }}</div>
        <i class="material-icons" @click="closePopup">close</i>
      </div>
      <div class="notification_content-info">
        <loader-transactions></loader-transactions>
        <div class="notification_info">
          {{ notification_info }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoaderTransactions from '@/components/loaders/LoaderTransactions';
import store from '../../store/index.js';


export default {
  name: 'notification',
  props: {
    // notification_title: {
    //   type: String,
    //   default: 'notification_title'
    // },
    // notification_info: {
    //   type: String,
    //   default: 'notification_action'
    // }
  },
  components: {LoaderTransactions},
  computed: {
    notification_title() {
      return store.getters.IN_TX;
    },
    notification_info() {
      return store.getters.ACTION_TX;
    }
  },
}
</script>

<style scoped lang="scss">
.notification {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 10;
  &_content {
    padding: 16px;
    border-radius: 4px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    //height: 50px;
    margin-bottom: 16px;
    background: #008bf6;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    &-info  {
      display: flex;
      align-items: center;
    }
  }
}
.green{
  background: green;
}
</style>
