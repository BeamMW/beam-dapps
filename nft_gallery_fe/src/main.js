import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import { Beam } from './utils/beamApi/beamAPI';
import utils from './utils/utils';
import 'material-design-icons-iconfont';

utils.initialize(
  {
    appname: 'BEAM NFT Gallery',
    min_api_version: '6.2',
    apiResultHandler: (...args) => {
      store.dispatch('GET_APIRESULT', ...args);
    },
  },
  (err) => {
    const vueApp = createApp(App);
    vueApp.use(store);
    vueApp.use(router);
    vueApp.mount('body');

    const {
      validator_error,
      content_main,
      appsGradientTop,
      appsGradientOffset,
      background_main_top,
      background_main,
    } = utils.getStyles();

    if (utils.isWeb()) {
      // document.body.style.margin = '5px';
      // document.body.style.overflow = 'scroll';
    }

    const topColor = [appsGradientOffset, 'px,'].join('');
    const mainColor = [appsGradientTop, 'px,'].join('');
    const style = document.createElement('style');
    style.innerHTML = `.error {color: ${validator_error};}`;
    document.head.appendChild(style);
    document.body.style.color = content_main;

    if (!utils.isDesktop()) {
      document.body.style.backgroundImage = [
        'linear-gradient(to bottom,',
        background_main_top,
        topColor,
        background_main,
        mainColor,
        background_main,
      ].join(' ');
    }

    if (err) {
      return store.dispatch('GET_ERR', err);
    }
    store.dispatch('GET_SHADER').then(() => {
      Beam.start();
    });
    // start();
  }
);
// vueApp.config.globalProperties.$store = store;
// vueApp.config.globalProperties.$state = store.state;
