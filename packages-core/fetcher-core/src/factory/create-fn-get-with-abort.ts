import {
  PromiseWithAbort,
  FetcherParams,
  makePromiseWithAbort
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsGet,
  IFetcherFnGetWithAbort
} from '../types';
import {
  configMerge,
  parseArgsGet
} from '../util';

export default function createFnGetWithAbort<X = object>(fetcher: IFetcherClass): IFetcherFnGetWithAbort<X> {
  return <T, P extends FetcherParams>(...args: TFetcherArgsGet<P>): PromiseWithAbort<T> => {
    const [config, url, params] = parseArgsGet(args);
    const abortController = new AbortController();
    
    return makePromiseWithAbort(fetcher.request<T>(configMerge(config, {
      url,
      method: 'GET',
      params,
      signal: abortController.signal
    })), abortController);
  };
}
