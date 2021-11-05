import html from '../utils/html.js';
import loading from './loading.js';
import dot from './dot.js';
import { parseToBeam } from '../utils/string-handlers.js';

export default {
  props: {
    seed: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      required: true
    },
    holder: {
      type: String,
      default: '',
    },
    aid: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    bytes: {
      type: String,
      default: undefined,
    },
    in_tx: {
      type: Boolean,
      default: false,
    },
    owned: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
  },

  emits: ['buy', 'sell'],

  computed: {
    ownerText() {
      // if (this.artist) return this.artist
      if (this.owned) return 'You own this item';
      return 'Somebody';
    },
  },

  render() {
    return html`
      <div class="item">
        ${this.renderPreview()}
        <div class="info-row">
          <span class="small darker">${this.ownerText}</span>
          <span
            class="small darker ${this.price && !this.in_tx ? '' : 'hidden'}"
            >Price</span
          >
        </div>
        <div class="info-row">
          <span
            >${this.renderDot()}<span class="normal bolder"
              >${this.holder}</span
            ></span
          >
          ${this.renderPrice()}
        </div>
      </div>
    `;
  },

  methods: {
    renderPreview() {
      if (this.bytes) {
        return html`
          <div class="preview-container">
            <img src=${this.bytes} />
          </div>
        `;
      } else {
        return html`
          <div class="preview-container">
            <${loading} />
          </div>
        `;
      }
    },

    renderDot() {
      if (!this.owned) {
        return '';
      }

      let state = 'green';
      // if (!this.approved) state = "red"
      return html`<${dot} state="${state}" />`;
    },

    renderPrice() {
      if (this.in_tx) {
        return html`<span class="small darker">Transaction in progress</span>`;
      }

      // if has price - just display it and return
      if (this.price) {
        let amount = parseToBeam(this.price);

        // if owned can cancel & change
        if (this.owned) {
          return html`<span class="normal bold">${amount} BEAM</span>`;
        }

        // if not owned can only buy
        if(!this.owned){
          return html`
          <span>
            <a href="#" onclick=${this.onBuy} class="buy">BUY</a>
            <span class="normal bold ml-hem">${amount} BEAM</span>
          </span>
        `;}
      }

      // // doesn't have price and is own image
      if (this.owned) {
        // if already approved then can sell
        // if (this.approved) {
        return html`<a href="#" class="buy" onclick=${this.onSell}>SELL</a>`;
        // }
        // otherwise wait for approval
        return html`<span class="small darker">Waiting for approval</span>`;
      }

      // doesn't have price and is not own image
      // means can be anything - not approved yet, not sold by
      // owner &c. Just dispaly that it is not on sale
      return html`<span class="small darker">Not on sale</span>`;
    },

    onBuy(ev) {
      ev.preventDefault();
      this.$emit('buy', this.id, this.seed);
      console.log(this.id, this.seed);
    },

    onSell(ev) {
      ev.preventDefault();
      this.$emit('sell', this.seed);
      console.log(this.id, this.seed);
    },
  },
};
