"use strict";

module.exports = function () {
  return {
    name: "comlink-loader",
    configureWebpack(config, isServer, { getBabelLoader }) {
      return {
        module: {
          rules: [
            {
              test: /\.worker\.(js|ts)$/,
              use: [
                // getBabelLoader(isServer),
                {
                  loader: "comlink-loader",
                  options: {
                    singleton: true
                  }
                },
                getBabelLoader(isServer)
              ]
            }
          ]
        }
      };
    }
  };
};
