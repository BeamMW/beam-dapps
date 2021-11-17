import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

export default {
  devtool: 'eval-source-map',
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[name][ext]'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    plugins: [new TsconfigPathsPlugin()],
    modules: [
      path.join(__dirname, './src/types'),
      path.join(__dirname, 'node_modules')
    ]
  },
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 5000,
    open: true,
    hot: true
  },
  experiments: {
    asyncWebAssembly: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg|wasm)$/,
        type: 'asset/resource'
        // use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new CompressionPlugin({
      include: /\/includes/,
      deleteOriginalAssets: true
    })
  ]
};
