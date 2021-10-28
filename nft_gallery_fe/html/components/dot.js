import html from '../utils/html.js'

export default {
    props: {
        state: {
            type: String,
            required: true,
            default: "gray"
        }
    },

    render () {
        return html`<span class="dot ${this.state}"/>`
    }
}
