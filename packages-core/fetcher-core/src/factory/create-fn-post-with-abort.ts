import {
  PromiseWithAbort,
  FetcherParams,
  FetcherBody,
  makePromiseWithAbort
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsPost,
  IFetcherFnPostWithAbort
} from '../types';
import {
  mergeConfig,
  parseArgsPost
} from '../util';

export default function createFnPostWithAbort<X = object>(fetcher: IFetcherClass, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'): IFetcherFnPostWithAbort<X> {
  return <T, B extends FetcherBody, P extends FetcherParams>(...args: TFetcherArgsPost<B, P>): PromiseWithAbort<T> => {
    const [config, url, body, params] = parseArgsPost(args);
    const abortController = new AbortController();
    
    return makePromiseWithAbort(fetcher.request<T>(mergeConfig(config, {
      url,
      method,
      params,
      body,
      signal: abortController.signal
    })), abortController);
  };
}
