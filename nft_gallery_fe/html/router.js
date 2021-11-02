import Assets  from './components/assets.js'

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes:  [
        {path: '/', component: Assets, name: "assets", props: true},
    ]
})