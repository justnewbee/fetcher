import {
  FetcherParams,
  urlBuild,
  urlMergeWithBase
} from '@fetchx/fetcher-helper';
import fetchSse, {
  FetchSseOptions,
  FetchSseResult
} from '@fetchx/fetcher-sse';

import {
  IFetcherSseFactoryOptions
} from './types';

export default function fetcherSseFactory({
  urlBase,
  getHeaders
}: IFetcherSseFactoryOptions = {}): (url: string, params?: FetcherParams, options?: FetchSseOptions) => FetchSseResult {
  return function fetcherSse(url: string, params?: FetcherParams, options?: FetchSseOptions): FetchSseResult {
    const sseUrl = urlMergeWithBase(urlBuild(url, params), urlBase);
    
    return fetchSse(sseUrl, getHeaders ? {
      headers: getHeaders(),
      ...options
    } : options);
  };
}
