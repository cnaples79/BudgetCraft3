const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('react');

  webpack.chainWebpack((config) => {
    config.resolve.alias.set('@', resolve(__dirname, 'src'));
  });

  return webpack.resolveConfig();
};