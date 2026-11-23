import {
  IFetcher,
  IFetcherConfigDefault,
  TFetcherAdapter
} from '../types';

import FetcherCore from './fetcher-core';
import createFnJsonp from './create-fn-jsonp';
import createFnJsonpWithAbort from './create-fn-jsonp-with-abort';
import createFnGet from './create-fn-get';
import createFnGetWithAbort from './create-fn-get-with-abort';
import createFnPost from './create-fn-post';
import createFnPostWithAbort from './create-fn-post-with-abort';

/**
 * Fetcher 工厂
 *
 * 创建 Fetcher 实例，但不会直接把实例返回，因为那样的话用起来会不舒服（方法无法脱离实例进行调用），
 * 所以实际上是返回了一组方法组合成的一个对象。
 */
export default function factory<X = object>(adapter?: TFetcherAdapter, defaultConfig?: IFetcherConfigDefault): IFetcher<X> {
  const fetcher = new FetcherCore(adapter, defaultConfig);
  
  return {
    request: fetcher.request.bind(fetcher),
    get: createFnGet(fetcher),
    post: createFnPost(fetcher, 'POST'),
    put: createFnPost(fetcher, 'PUT'),
    patch: createFnPost(fetcher, 'PATCH'),
    delete: createFnPost(fetcher, 'DELETE'),
    jsonp: createFnJsonp(fetcher),
    withAbort: {
      get: createFnGetWithAbort<X>(fetcher),
      post: createFnPostWithAbort<X>(fetcher, 'POST'),
      put: createFnPostWithAbort<X>(fetcher, 'PUT'),
      patch: createFnPostWithAbort<X>(fetcher, 'PATCH'),
      delete: createFnPostWithAbort<X>(fetcher, 'DELETE'),
      jsonp: createFnJsonpWithAbort<X>(fetcher)
    },
    setAdapter: fetcher.setAdapter.bind(fetcher),
    setUrlBase: fetcher.setUrlBase.bind(fetcher),
    interceptRequest: fetcher.interceptRequest.bind(fetcher),
    interceptResponse: fetcher.interceptResponse.bind(fetcher),
    freeze: fetcher.freeze.bind(fetcher)
  };
}
