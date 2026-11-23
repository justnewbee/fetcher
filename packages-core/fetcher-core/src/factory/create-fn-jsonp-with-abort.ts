import {
  PromiseWithAbort,
  FetcherParams,
  makePromiseWithAbort
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsJsonp,
  IFetcherFnJsonpWithAbort
} from '../types';
import {
  configMerge,
  parseArgsJsonp
} from '../util';

export default function createFnGetWithAbort<X = object>(fetcher: IFetcherClass): IFetcherFnJsonpWithAbort<X> {
  return <T, P extends FetcherParams>(...args: TFetcherArgsJsonp<P>): PromiseWithAbort<T> => {
    const [config, url, params] = parseArgsJsonp(args);
    const abortController = new AbortController();
    
    return makePromiseWithAbort(fetcher.request<T>(configMerge(config, {
      url,
      method: 'JSONP',
      params,
      signal: abortController.signal
    })), abortController);
  };
}
