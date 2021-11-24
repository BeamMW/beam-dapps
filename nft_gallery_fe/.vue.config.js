const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
// const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
        chainWebpack: (config) => {
            config.module
                .rule("wasm")
                .test(/\.wasm$/)
                .use("wasm-loader")
                .loader("wasm-loader")
                .end();
        },
    }