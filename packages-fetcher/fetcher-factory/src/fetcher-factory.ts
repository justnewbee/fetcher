import {
  Fetcher,
  createFetcher
} from '@fetchx/fetcher';
import interceptBiz from '@fetchx/fetcher-interceptor-biz';
import interceptCacheLocal from '@fetchx/fetcher-interceptor-cache-local';

import {
  IFetcherConfigX,
  IFetcherFactoryOptions
} from './types';
import fetcherSetup from './fetcher-setup';

export default function fetcherFactory({
  urlBase,
  getHeaders,
  interceptorMergingOptions,
  interceptorBizOptions,
  interceptorSlsOptions,
  interceptorLoginOptions
}: IFetcherFactoryOptions = {}): Fetcher<IFetcherConfigX> {
  const fetcher = createFetcher<IFetcherConfigX>({
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
