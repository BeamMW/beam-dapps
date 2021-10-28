import App    from './components/app.js'
import utils  from './utils/utils.js'

utils.onLoad(beam => {
    const vueApp = Vue.createApp(App, {beam})
    return vueApp.mount('body')
})
