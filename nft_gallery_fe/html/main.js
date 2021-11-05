import App    from './components/app.js'
import { router } from './router.js'
import { store } from './store.js'
import utils  from './utils/utils.js'

utils.initialize(
    {
        "appname": "BEAM NFT Gallery",
        "min_api_version": "6.1",
        "apiResultHandler": (...args) => store.onApiResult(...args)
    }, 
    (err) => {
        const vueApp = Vue.createApp(App);
        vueApp.config.globalProperties.$store = store;
        vueApp.config.globalProperties.$state = Vue.readonly(store.state);
        vueApp.use(router);
        vueApp.mount('body');

        const { validator_error, 
                content_main,
                appsGradientTop,
                appsGradientOffset,
                background_main_top,
                background_main
        } = utils.getStyles();

        if (utils.isWeb()) {
            // document.body.style.margin = '5px';
            // document.body.style.overflow = 'scroll';
        }
        
        const topColor =  [appsGradientOffset, "px,"].join('');
        const mainColor = [appsGradientTop, "px,"].join('');
        const style = document.createElement('style');
        style.innerHTML = `.error {color: ${validator_error};}`;
        document.head.appendChild(style);
        document.body.style.color = content_main;

        if (!utils.isDesktop()) {
            document.body.style.backgroundImage = [
                "linear-gradient(to bottom,",
                background_main_top, topColor,
                background_main, mainColor,
                background_main
            ].join(' ');
        }
        

        if (err) {
            return store.setError(err);
        }

        store.start();
    }
)
// vueApp.config.globalProperties.$store = store;
// vueApp.config.globalProperties.$state = store.state;