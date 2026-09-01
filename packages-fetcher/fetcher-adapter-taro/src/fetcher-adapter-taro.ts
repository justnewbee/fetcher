import Taro, {
  request
} from '@tarojs/taro';
import {
  FetcherHeadersNormalized,
  headersNormalize
} from '@fetchx/fetcher-helper-headers';
import {
  FetcherErrorName,
  FetcherConfig,
  FetcherResponse,
  FetcherBodyNormalized,
  createFetcherError
} from '@fetchx/fetcher-core';

import {
  toTaroResponseType,
  ensureError
} from './util';

export default function fetcherAdapterTaro<T = unknown>(url: string, headers: FetcherHeadersNormalized, body: FetcherBodyNormalized, config: FetcherConfig): Promise<FetcherResponse<T>> {
  const {
    method = 'GET',
    signal,
    responseType = 'json',
    ...restConfig
  } = config;
  
  return request<T>({
    ...restConfig,
    method: method as Taro.request.Option['method'],
    url,
    header: headers,
    data: body,
    responseType: toTaroResponseType(responseType),
    signal: signal ?? undefined
  }).then(result => {
    if (result.statusCode < 200 || result.statusCode >= 300) {
      throw createFetcherError(config, {
        name: FetcherErrorName.RESPONSE_STATUS,
        message: `Response status ${result.statusCode}.`,
        code: `${result.statusCode}`,
        responseHeaders: headersNormalize(result.header),
        responseData: result.data // 401 等状态还是会有 data
      });
    }
    
    // 若访问的是当前 location 下地址
    // MP data 会是 HTML 串（不论是否 404 地址）
    // H5 data 是 null
    if (responseType === 'json' && (!result.data || typeof result.data === 'string')) {
      throw createFetcherError(config, {
        name: FetcherErrorName.RESPONSE_PARSE,
        responseHeaders: headersNormalize(result.header),
        responseData: result.data
      });
    }
    
    return {
      url,
      data: result.data,
      headers: headersNormalize(result.header)
    };
  }, (err: unknown) => {
    const originalError = ensureError(err);
    
    // 超时的情况下，Taro 内部用的是 AbortController，到这里无法感知是否为超时还是用户手动 abort
    if (originalError.name === 'AbortError') {
      throw originalError;
    }
    
    // MP，无权限接口（包括不存在的）会到这里 { errMsg: 'request:fail url not in domain list', errno: undefined }
    // H5，不存在的接口会报 CORS，得到 NetworkError
    throw createFetcherError(config, {
      name: FetcherErrorName.NETWORK,
      originalError
    });
  });
}
