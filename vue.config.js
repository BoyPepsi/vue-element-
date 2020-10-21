module.exports = {
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    port: 8088,
    // proxy: {}
  },
  configureWebpack: (config) => {
    config.entry.app = ["babel-polyfill", "./src/main.js"];
  },
};
