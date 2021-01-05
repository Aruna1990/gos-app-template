const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#508BEE",
              "@link-color": "#508BEE",
              "@border-radius-base": "2px",
              "@tabs-highlight-color": "#508BEE"
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};