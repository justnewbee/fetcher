import {
  IFetcherSse,
  TFetcherSseAdapter,
  IFetcherSseConfig
} from '../types';

import FetcherSseCore from './fetcher-sse-core';

/**
 * FetcherSse 工厂
 */
export default function factory(adapter?: TFetcherSseAdapter, defaultConfig?: IFetcherSseConfig): IFetcherSse {
  const fetcherSse = new FetcherSseCore(adapter, defaultConfig);
  
  return {
    request: fetcherSse.request.bind(fetcherSse),
    setAdapter: fetcherSse.setAdapter.bind(fetcherSse),
    setUrlBase: fetcherSse.setUrlBase.bind(fetcherSse),
    setHeaders: fetcherSse.setHeaders.bind(fetcherSse),
    freeze: fetcherSse.freeze.bind(fetcherSse)
  };
}
