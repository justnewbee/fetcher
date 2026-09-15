import {
  FetcherHeaders
} from '@fetchx/fetcher-helper';
import {
  FetcherSseAdapterOptions
} from '@fetchx/fetcher-sse-core';
import fetcherSse from '@fetchx/fetcher-sse';

export default function fetcherSseAdapterWeb(url: string, headers?: FetcherHeaders, options?: FetcherSseAdapterOptions): Promise<void> {
  return fetcherSse(url, {
    ...options,
    headers
  });
}
