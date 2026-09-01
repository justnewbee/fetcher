import {
  FetcherHeaders,
  mergeHeaders
} from '@fetchx/fetcher-helper-headers';

import {
  IFetcherConfig
} from '../types';

export default function mergeConfigHeaders(config: IFetcherConfig, headers?: FetcherHeaders): void {
  if (!headers) {
    return;
  }
  
  if (!config.headers) {
    config.headers = headers;
    
    return;
  }
  
  config.headers = mergeHeaders(config.headers, headers);
}
