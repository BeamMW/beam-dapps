import App    from './components/app.js'
import { router } from './router.js'
import { store } from './store.js'
import utils  from './utils/utils.js'

utils.onLoad(beam => {
    const vueApp = Vue.createApp(App, {beam})
    return vueApp.use(store).use(router).mount('body')
})
// vueApp.config.globalProperties.$store = store;
// vueApp.config.globalProperties.$state = store.state;