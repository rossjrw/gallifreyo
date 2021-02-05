const webpack = require("webpack")
const path = require("path")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const TerserPlugin = require("terser-webpack-plugin")
const version = require("project-version")

module.exports = {
  mode: process.env.NODE_ENV,
  ...(
    process.env.NODE_ENV === "development"
    ? { devtool: "eval-source-map" }
    : {}
  ),
  entry: {
    main: "./src/index.ts",
    collisions: "./src/collisions/index.ts",
  },
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      { test: /\.vue$/, use: ["vue-loader"] },
      { test: /\.ts$/, use: "babel-loader" },
      {
        test: /\.s[ac]ss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
      { test: /\.toml$/, use: ["raw-loader"] },
      { test: /\.svg$/, use: ["svg-url-loader"] },
    ],
  },
  resolve: { extensions: [".ts", ".js", ".vue"] },
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [ new TerserPlugin({ extractComments: false }) ],
    usedExports: true
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version)
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "Gallifreyo · Gallifreyan Translator",
      template: "./src/template.ejs",
      filename: "index.html",
      chunks: ["main"],
      meta: { viewport: "width=device-width, initial-scale=1" },
    }),
    new HtmlWebpackPlugin({
      title: "Gallifreyo · Collisions Test",
      template: "./src/template.ejs",
      filename: "collisions/index.html",
      chunks: ["collisions"],
      meta: { viewport: "width=device-width, initial-scale=1" },
    }),
  ],
};
