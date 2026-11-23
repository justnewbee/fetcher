import {
  FetcherParams
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsJsonp,
  IFetcherFnJsonp
} from '../types';
import {
  configMerge,
  parseArgsJsonp
} from '../util';

export default function createFnJsonp<X = object>(fetcher: IFetcherClass): IFetcherFnJsonp<X> {
  return <T, P extends FetcherParams>(...args: TFetcherArgsJsonp<P>): Promise<T> => {
    const [config, url, params] = parseArgsJsonp(args);
    
    return fetcher.request<T>(configMerge(config, {
      url,
      method: 'JSONP',
      params
    }));
  };
}
