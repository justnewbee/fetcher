import {
  FetcherHeaders,
  headersMerge
} from '@fetchx/fetcher-helper';

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
  
  config.headers = headersMerge(config.headers, headers);
}
