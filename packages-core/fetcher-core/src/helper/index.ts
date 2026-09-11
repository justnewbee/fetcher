/**
 * 仅供外部是要用，不在此包中使用的帮助方法
 */
export { default as getResponseHeader } from './get-response-header';
export { default as cloneResponseData } from './clone-response-data';
export { default as createFetcherErrorSkipNetwork } from './create-fetcher-error-skip-network';

export {
  isConfigJsonp,
  buildUrl,
  createFetcherError
} from '../util';
