import html from '../utils/html.js';
import utils from '../utils/utils.js';
import assets from './assets.js';
import loading from './loading.js';
import error from './error.js';

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
			'30a547a38101b725a10442beaf6acb4a02a7ee8c3923cddbcebf29ca869bba3b';
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
	},

	render() {
		if (this.error) {
			return html` <${error}
				error=${this.error.error}
				context=${this.error.context}
				onClearError=${this.clearError}
			/>`;
		}

		if (this.loading) {
			return html`<${loading} />`;
		}

		return html`
			<${assets}
				cid=${this.cid}
				artist_key=${this.artist_key}
				changed_txs=${this.changed_txs}
			/>
		`;
	},

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
