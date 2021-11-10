import Loading from './loading.js'
import ErrView from './error.js'
import Generate from './generate.js'

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
        error: ErrView,
		generate: Generate
    },

    template: `
        <error v-if="error" 
            v-bind:error="error.error"
            v-bind:context="error.context"
        >
        </error>
        <loading v-else-if='loading'></loading>
        <div v-else class="app">
		<div class="nav-container">
    	<div class="nav"><router-link to="/">Home</router-link> 
    	<router-link to="/myseeds">My Pic</router-link> 
    	<generate></generate> 
		</div>
  		</div>
		<router-view></router-view>
		</div>
    `
}
