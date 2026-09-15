import {
  PromiseWithAbort,
  FetcherParams,
  makePromiseWithAbort
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsJsonp,
  IFetcherFnGetWithAbort
} from '../types';
import {
  mergeConfig,
  parseArgsGet
} from '../util';

export default function createFnGetWithAbort<X = object>(fetcher: IFetcherClass, method: 'GET' | 'JSONP'): IFetcherFnGetWithAbort<X> {
  return <T, P extends FetcherParams>(...args: TFetcherArgsJsonp<P>): PromiseWithAbort<T> => {
    const [config, url, params] = parseArgsGet(args);
    const abortController = new AbortController();
    
    return makePromiseWithAbort(fetcher.request<T>(mergeConfig(config, {
      url,
      method,
      params,
      signal: abortController.signal
    })), abortController);
  };
}
