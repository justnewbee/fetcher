import {
  Fetcher
} from '@fetchx/fetcher-core';

import {
  IFetcherInterceptorBizOptions
} from './types';
import {
  createInterceptorResponseFulfilled
} from './util';

export default function interceptBiz(fetcher: Fetcher, options?: IFetcherInterceptorBizOptions, priority?: number): () => void {
  return fetcher.interceptResponse(createInterceptorResponseFulfilled(options), undefined, priority);
}
