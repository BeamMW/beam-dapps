import html from '../utils/html.js';
import utils from '../utils/utils.js';
import assets from './assets.js';
import Loading from './loading.js';
import ErrView from './error.js';
import generate from './generate.js';
import { store } from '../store.js';
import { router } from '../router.js';

export default {
	props: {
		beam: {
			type: Object,
			required: true,
		},
	},

	created() {
		this.shader = undefined;
		this.cid =
			'19bda81c54f0e578cffe31b369067ff3f4581f96f6d4c43cc61d43fb8a8d49e2';
	},

	data() {
		return {
			loading: true,
			artist_key: '',
			changed_txs: [],
			error: undefined,
		};
	},

	computed: {
		style() {
			return this.beam ? this.beam.style : undefined;
		},
		api() {
			return this.beam ? this.beam.api : undefined;
		},
		loading () {
            return  store.state.loading
        },
        error () {
            return store.state.error
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
	`,

	methods: {
		setError(error, context) {
			if (error) {
				this.error = {
					error: utils.formatJSON(error),
					context,
				};
			} else {
				this.error = undefined;
			}
		},

		clearError() {
			this.error = undefined;
			this.start();
		},

		start() {
			// adjust styles
			const style = document.createElement('style');
			style.innerHTML = `.error {color: ${this.style.validator_error};}`;
			document.head.appendChild(style);
			document.body.style.color = this.style.content_main;
			// Start real thing
			utils.download('./app.wasm', (err, bytes) => {
				if (err) return this.setError(err, 'Shader download');
				this.shader = bytes;
				// utils.invokeContract("", (...args) => this.onShowMethods(...args), this.shader)
				utils.callApi("ev_subunsub", {ev_txs_changed: true}, (...args) => this.checkError(...args))
				utils.invokeContract(
					'role=manager,action=view',
					(...args) => this.onCheckCID(...args),
					this.shader
				);
			});
		},

		onApiResult(err, res, full) {
			if (err) {
				return this.setError(err, 'API handling error');
			}

			if (full.id == 'ev_txs_changed') {
				let txs = full.result.txs;
				let changed = [];

				for (let tx of txs) {
					if (tx.status == 2 || tx.status == 3 || tx.status == 4) {
						changed.push(tx.txId);
					}
				}

				if (changed.length) {
					this.changed_txs = changed;
				}

				return;
			}

			this.setError(full, 'Unexpected API result');
		},

		onCheckCID(err, res) {
			if (err) {
				return this.setError(err);
			}

			if (!res.contracts.some(el => el.cid == this.cid)) {
				throw `Failed to verify cid '${this.cid}'`;
			}
			this.loading = false;
			utils.invokeContract(
				`role=manager,action=seeds,cid=${store.state.cid}`,
				(...args) => this.onLoadSeeds(...args)
			  );
		},

		onLoadSeeds(err, res) {
			store.LoadSeeds(err, res)
		   },

		onShowMethods(err, res) {
			if (err) return this.setError(err);
			console.log(utils.formatJSON(res));
		},

		checkError(err) {
			if (err) return this.setError(err);
		},
	},
};
