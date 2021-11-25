<template>
  <div class="wrapper" ref="popupWrapper">
    <div class="popup">
      <div class="header">
        <span class="headerTitle">{{ popupTitle }}</span>
        <i class="material-icons material-icons_close" @click="closePopup"
          >close</i
        >
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <div class="footer">
        <button class="popupBtn cancelBtn" @click="closePopup">Cancel</button>
        <button class="popupBtn submitBtn" @click="actionPopup">{{ actionTitle }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: {
    popupTitle: {
      type: String,
      default: 'Popup name',
    },
    actionTitle: {
      type: String,
      default: 'Action Title',
    },
  },
  data() {
    return {};
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    actionPopup() {
      this.$emit('actionPopup');
    },
  },
  mounted() {
    let vm = this;
    document.addEventListener('click', (item) => {
      if (item.target === vm.$refs['popupWrapper']) {
        vm.closePopup();
      }
    });
  },
};
</script>

<style lang="scss">
.wrapper {
  z-index: 19;
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(193, 193, 193, 0.3);
  justify-content: center;
  align-items: center;
}
.popup {
  z-index: 20;
  width: 600px;
  // height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: #005a8f;
  // box-shadow: 0px 8px 36px rgba(0, 0, 0, 0.16);
  border-radius: 16px;
}
.header {
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background: #1890ff;
  border-radius: 16px 16px 0 0;
}
.footer {
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background: #1890ff;
  border-radius: 0 0 16px 16px;
}
.content {
  width: 100%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
// .inputPopup {
//   padding: 10px;
// }
.headerTitle {
  margin-left: 10px;
}
.material-icons_close {
  cursor: pointer;
  margin-right: 10px;
}
.cancelBtn {
  margin-left: 10px;
  background: brown;
}
.submitBtn {
  margin-right: 10px;
  background: rgb(2, 138, 70);
}
.popupBtn {
  width: 100px;
  height: 30px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  color: #fff;
}
</style>
