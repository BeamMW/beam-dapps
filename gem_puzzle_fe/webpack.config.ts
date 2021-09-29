import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// const GenerateSW  = require('workbox-webpack-plugin').GenerateSW;

// const FontPreloadPlugin = require("webpack-font-preload-plugin");

export default {
  devtool: 'eval-source-map',
  entry: './src/index.ts',
  devServer: {
    inline: true,
    open: true,
    port: 5000,
    historyApiFallback: true,
    hot: true
  },
  experiments: {
    asyncWebAssembly: true
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      { test: /\.ts$/, use: 'ts-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|wasm)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[hash][ext]'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    // new GenerateSW({
    //   runtimeCaching: [
    //     {
    //       urlPattern: /^https:\/\/fonts\.gstatic\.com/,
    //       handler: 'StaleWhileRevalidate',
    //       options: {
    //         cacheName: 'google-fonts-webfonts'
    //       }
    //     }
    //   ]
    // }),
    // new FontPreloadPlugin({
    //   index: "index.html",
    //   extensions: ["ttf", "woff", "woff2"],
    //   crossorigin: true,
    //   loadType: "preload",
    // }),
    new HtmlWebpackPlugin({
      inject: true,
      title: 'beamer',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css'
    })
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};