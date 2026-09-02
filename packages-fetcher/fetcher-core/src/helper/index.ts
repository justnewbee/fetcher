/**
 * 仅供外部是要用，不在此包中使用的帮助方法
 */
export { default as getResponseHeader } from './get-response-header';
export { default as cloneResponseData } from './clone-response-data';
export { default as createFetcherErrorSkipNetwork } from './create-fetcher-error-skip-network';

// 可能需要用到的 util TODO 提取到外部 helper 包
export {
  isInstanceofBlob,
  isInstanceofArrayBuffer,
  isInstanceofFormData,
  isInstanceofUrlSearchParams,
  isConfigJsonp,
  cloneTypeFormData,
  cloneTypeUrlSearchParams,
  createFetcherError,
  buildUrl
} from '../util';
