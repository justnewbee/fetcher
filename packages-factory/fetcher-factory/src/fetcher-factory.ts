import factory, {
  Fetcher
} from '@fetchx/fetcher-core';
import fetcherAdapterWeb from '@fetchx/fetcher-adapter-web';
import interceptBiz from '@fetchx/fetcher-interceptor-biz';
import interceptCacheLocal from '@fetchx/fetcher-interceptor-cache-local';

import {
  IFetcherConfigX,
  IFetcherFactoryOptions
} from './types';
import fetcherSetup from './fetcher-setup';

export default function fetcherFactory({
  adapter = fetcherAdapterWeb,
  urlBase,
  getHeaders,
  interceptorMergingOptions,
  interceptorBizOptions,
  interceptorSlsOptions,
  interceptorLoginOptions
}: IFetcherFactoryOptions = {}): Fetcher<IFetcherConfigX> {
  const fetcher = factory<IFetcherConfigX>(adapter, {
    urlBase,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  interceptBiz(fetcher, interceptorBizOptions);
  interceptCacheLocal(fetcher);
  
  fetcherSetup(fetcher, {
    getHeaders,
    interceptorMergingOptions,
    interceptorSlsOptions,
    interceptorLoginOptions
  }, false);
  
  return fetcher;
}
