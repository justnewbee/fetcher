import {
  FetcherParams,
  FetcherBody
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsPost,
  IFetcherFnPostWithAbort,
  IPromiseWithAbort
} from '../types';
import {
  mergeConfig,
  parseArgsPost
} from '../util';

export default function createFnPostWithAbort<X = object>(fetcher: IFetcherClass, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'): IFetcherFnPostWithAbort<X> {
  return <T, B extends FetcherBody, P extends FetcherParams>(...args: TFetcherArgsPost<B, P>): IPromiseWithAbort<T> => {
    const [config, url, body, params] = parseArgsPost(args);
    const abortController = new AbortController();
    const abort = (): void => abortController.abort();
    const promise = fetcher.request<T>(mergeConfig(config, {
      url,
      method,
      params,
      body,
      signal: abortController.signal
    })) as IPromiseWithAbort<T>;
    
    promise.abort = abort;
    
    return promise;
  };
}
