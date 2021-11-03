import Loading from './loading.js'
import ErrView from './error.js'

export default {
    computed: {
        loading () {
            return  this.$state.loading
        },
        error () {
            return this.$state.error
        }
    },

    components: {
        loading: Loading,
        error: ErrView
    },

    template: `
        <error v-if="error" 
            v-bind:error="error.error"
            v-bind:context="error.context"
        >
        </error>
        <loading v-else-if='loading'></loading>
        <router-view v-else></router-view>
    `
}
