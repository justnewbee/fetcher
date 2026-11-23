import {
  FetcherParams
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsGet,
  IFetcherFnGet
} from '../types';
import {
  configMerge,
  parseArgsGet
} from '../util';

export default function createFnGet<X = object>(fetcher: IFetcherClass): IFetcherFnGet<X> {
  return <T, P extends FetcherParams>(...args: TFetcherArgsGet<P>): Promise<T> => {
    const [config, url, params] = parseArgsGet(args);
    
    return fetcher.request<T>(configMerge(config, {
      url,
      method: 'GET',
      params
    }));
  };
}
