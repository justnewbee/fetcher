import fetcherFetch, {
  FetchErrorName
} from '@fetchx/fetcher-fetch';
import fetcherXhr, {
  XhrErrorName
} from '@fetchx/fetcher-xhr';
import fetcherJsonp, {
  JsonpErrorName
} from '@fetchx/fetcher-jsonp';
import {
  FetcherHeadersNormalized
} from '@fetchx/fetcher-helper-headers';
import {
  FetcherErrorName,
  FetcherResponse,
  FetcherBodyNormalized,
  isConfigJsonp
} from '@fetchx/fetcher-core';

import {
  IFetcherConfig
} from './types';
import {
  buildResponse
} from './util';

/**
 * 将 fetch 和 jsonp 整合在一起（method 为 'JSONP' 时发送 JSONP 请求）
 */
export default async function fetchAdapterWeb<T = unknown>(url: string, headers: FetcherHeadersNormalized, body: FetcherBodyNormalized, config: IFetcherConfig): Promise<FetcherResponse<T>> {
  try {
    if (isConfigJsonp(config)) { // JSONP 用不到 headers 和 body
      return await buildResponse<T>(await fetcherJsonp<T>(url, {
        timeout: config.timeout,
        charset: config.charset,
        jsonpCallback: config.jsonpCallback,
        jsonpCallbackFunction: config.jsonpCallbackFunction,
        signal: config.signal
      }), config);
    }
    
    if (config.onProgress) { // 上传进度需要底层用 xhr，没法用 fetch
      return await buildResponse(await fetcherXhr<T>(url, {
        method: config.method,
        timeout: config.timeout,
        signal: config.signal,
        withCredentials: config.credentials !== 'omit',
        headers,
        body,
        onProgress: config.onProgress
      }), config);
    }
    
    const { // 剔除 JSONP 参数
      charset,
      jsonpCallback,
      jsonpCallbackFunction,
      ...restConfig
    } = config;
    
    return await buildResponse<T>(await fetcherFetch(url, {
      ...restConfig,
      headers,
      body
    }), config);
  } catch (err) {
    const error = err as Error | null;
    
    if (error?.name) { // 标准化为 Fetcher 定义好的名称
      switch (error.name as FetchErrorName | XhrErrorName | JsonpErrorName) {
      case FetchErrorName.NETWORK:
      case XhrErrorName.NETWORK:
      case JsonpErrorName.NETWORK:
        error.name = FetcherErrorName.NETWORK;
        
        break;
      case FetchErrorName.TIMEOUT:
      case XhrErrorName.TIMEOUT:
      case JsonpErrorName.TIMEOUT:
        error.name = FetcherErrorName.TIMEOUT;
        
        break;
      default:
        break;
      }
      
      throw error;
    }
    
    throw err;
  }
}
