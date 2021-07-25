const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
    '@modules': path.resolve(__dirname, 'src/modules'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  }),
);
