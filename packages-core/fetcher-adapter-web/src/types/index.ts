import {
  JsonpOptions
} from '@fetchx/fetcher-jsonp';
import {
  FetcherConfig
} from '@fetchx/fetcher-core';

export interface IFetcherConfig extends FetcherConfig, JsonpOptions {}
