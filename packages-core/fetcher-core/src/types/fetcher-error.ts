import {
  FetcherHeadersFallbackNormalized
} from '@fetchx/fetcher-helper-headers';

import {
  IFetcherConfig
} from './config';

export interface IErrorExtendedInfo {
  /**
   * 预留扩展字段 - 错误码
   */
  code?: string;
  /**
   * 预留扩展字段 - 错误标题
   */
  title?: string;
  /**
   * 预留扩展字段 - 原始 response 中的 header
   */
  responseHeaders?: Headers | FetcherHeadersFallbackNormalized | null;
  /**
   * 预留扩展字段 - 原始 response 中的数据；强行把返回变成出错时需要
   */
  responseData?: unknown;
}

/**
 * 错误
 */
export interface IFetcherError extends Error, IErrorExtendedInfo {
  config?: IFetcherConfig;
}

/**
 * 特殊错误，用于绕过网络请求，直接返回 `result`，在某些拦截器中可以用到
 */
export interface IFetcherErrorSkipNetwork<T = void> extends IFetcherError {
  name: 'FetcherSkipNetwork';
  result: T | Promise<T>;
}
