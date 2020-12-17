import GosSDK from 'gos-js-sdk';

export const gosSDK = new GosSDK({
  host: process.env.REACT_APP_API_HOST,
  appName: 'demo',
  proxy: 'proxy',
});
