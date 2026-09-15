import {
  FetcherHeaders
} from '@fetchx/fetcher-helper';
import {
  FetcherSseAdapter
} from '@fetchx/fetcher-sse-core';

export interface IFetcherSseFactoryOptions {
  adapter?: FetcherSseAdapter;
  urlBase?: string;
  getHeaders?(): FetcherHeaders;
}
