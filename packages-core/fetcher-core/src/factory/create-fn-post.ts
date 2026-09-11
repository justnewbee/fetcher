import {
  FetcherParams,
  FetcherBody
} from '@fetchx/fetcher-helper';

import {
  IFetcherClass,
  TFetcherArgsPost,
  IFetcherFnPost
} from '../types';
import {
  mergeConfig,
  parseArgsPost
} from '../util';

export default function createFnPost<X = object>(fetcher: IFetcherClass, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'): IFetcherFnPost<X> {
  return <T, B extends FetcherBody, P extends FetcherParams>(...args: TFetcherArgsPost<B, P>): Promise<T> => {
    const [config, url, body, params] = parseArgsPost(args);
    
    return fetcher.request<T>(mergeConfig(config, {
      url,
      method,
      params,
      body
    }));
  };
}
