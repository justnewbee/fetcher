import fetcherFetch, {
  FetchErrorName
} from '@fetchx/fetcher-fetch';
import fetcherXhr, {
  XhrResponse,
  XhrErrorName
} from '@fetchx/fetcher-xhr';
import fetcherJsonp, {
  JsonpResponse,
  JsonpErrorName
} from '@fetchx/fetcher-jsonp';
import {
  FetcherHeadersNormalized
} from '@fetchx/fetcher-helper';
import {
  FetcherErrorName,
  FetcherResponse,
  FetcherBodyNormalized
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
  const {
    method,
    timeout,
    signal,
    jsonpCharset,
    jsonpCallback,
    jsonpCallbackFunction,
    ...restConfig
  } = config;
  
  try {
    let responsePromise: Promise<JsonpResponse<T> | XhrResponse<T> | Response>;
    
    if (method && /^JSONP$/i.test(method)) { // JSONP 用不到 headers 和 body
      responsePromise = fetcherJsonp<T>(url, {
        timeout,
        signal,
        charset: jsonpCallback,
        jsonpCallback,
        jsonpCallbackFunction
      });
    } else if (restConfig.onProgress) { // 上传进度需要底层用 xhr，没法用 fetch
      responsePromise = fetcherXhr<T>(url, {
        method,
        timeout,
        signal,
        withCredentials: restConfig.credentials !== 'omit',
        headers,
        body,
        onProgress: restConfig.onProgress
      });
    } else {
      responsePromise = fetcherFetch(url, {
        ...restConfig,
        method,
        timeout,
        signal,
        headers,
        body
      });
    }
    
    return await buildResponse(responsePromise, config);
  } catch (err) {
    const error = err as Error | null;
    
    if (error?.name) { // 标准化为 Fetcher 定义好的名称
      switch (error.name as unknown as FetchErrorName | XhrErrorName | JsonpErrorName) {
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
