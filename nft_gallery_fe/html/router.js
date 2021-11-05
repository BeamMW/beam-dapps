import Assets  from './components/assets.js'
// import Generate  from './components/generate.js'
import MySeeds  from './components/myseeds.js'

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes:  [
        {path: '/', component: Assets, name: "assets", props: true},
        // {path: '/generate', component: Generate, name: "generate", props: true},
        {path: '/myseeds', component: MySeeds, name: "mySeeds", props: true},
    ]
})