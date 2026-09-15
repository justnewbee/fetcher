import {
  FetcherSse
} from '@fetchx/fetcher-sse-core';

import {
  IFetcherSseFactoryOptions
} from './types';

export default function fetcherSseSetup(fetcherSse: FetcherSse, options: IFetcherSseFactoryOptions, freeze = true): void {
  if (options.adapter) {
    fetcherSse.setAdapter(options.adapter);
  }
  
  if (options.urlBase) {
    fetcherSse.setUrlBase(options.urlBase);
  }
  
  if (options.getHeaders) {
    fetcherSse.setHeaders(options.getHeaders);
  }
  
  if (freeze) {
    fetcherSse.freeze();
  }
}
