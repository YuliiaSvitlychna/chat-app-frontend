const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "js"),
    clean: true,
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env',
      safe: false,
      allowEmptyValues: true,
      systemvars: true,
      silent: false,
      defaults: false,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
