import {
  buildUrl
} from '@fetchx/fetcher-core';
import fetchSse, {
  FetchSseOptions,
  FetchSseResult
} from '@fetchx/fetch-sse';

import {
  IFetcherSseFactoryOptions
} from './types';

export default function fetcherSseFactory({
  urlBase,
  getHeaders
}: IFetcherSseFactoryOptions = {}): (url: string, params?: object | null, options?: FetchSseOptions) => FetchSseResult {
  return function fetcherSse(url: string, params?: object | null, options?: FetchSseOptions): FetchSseResult {
    return fetchSse(buildUrl({
      url,
      urlBase,
      params: params as Record<string, unknown> | undefined
    }), getHeaders ? {
      headers: getHeaders(),
      ...options
    } : options);
  };
}
