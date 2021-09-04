const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
    '@modules': path.resolve(__dirname, 'src/modules'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@store': path.resolve(__dirname, 'src/store'),
    '@socket': path.resolve(__dirname, 'src/socket'),
    '@models': path.resolve(__dirname, 'src/typedef/models'),
    '@http': path.resolve(__dirname, 'src/http'),
    '@assets': path.resolve(__dirname, 'src/assets'),
  }),
);
