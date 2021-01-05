import GosSDK from 'gos-js-sdk';
import { stringify } from 'querystringify';

export const configs = {
  host: process.env.REACT_APP_API_HOST || window.location.host,
  appName: 'aifactory',
  proxy: 'proxy',
};

export const gosSDK = new GosSDK(configs);

const dataApiRoot = `${gosSDK.getPrefix(configs.host, configs.appName, configs.proxy)}/aifactory/data/api/v1`;
const algorithmApiRoot = `${gosSDK.getPrefix(configs.host, configs.appName, configs.proxy)}/aifactory/algorithm/api/v1`;

export const RESOURCE_ROOT = `${gosSDK.getPrefix(configs.host, configs.appName, configs.proxy)}:9000`;
// export const RESOURCE_ROOT = `//10.2.36.17:9000`;

export function getAIList(params) {
  return gosSDK.request(`${dataApiRoot}/aiItem?${stringify(params)}`)
}
export function getAIItem(id) {
  return gosSDK.request(`${dataApiRoot}/aiItem/${id}`)
}

export function getCollectList(params) {
  return gosSDK.request(`${dataApiRoot}/collections?${stringify(params)}`)
}
export function createCollection(params) {
  return gosSDK.request(`${dataApiRoot}/collections`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function getLabelList(datasetId, params) {
  return gosSDK.request(`${dataApiRoot}/dataset/${datasetId}/tag?${stringify(params)}`)
}

export function updateLabel(params) {
  return gosSDK.request(`${dataApiRoot}/dataset/file/tag?${stringify(params)}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  })
}

export function train(params) {
  return gosSDK.request(`${algorithmApiRoot}/train/command`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function subscripe(params) {
  return gosSDK.request(`${gosSDK.event.apiRoot}/topic/subscription`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}


