import {
  FetcherHeaders,
  headersMerge
} from '@fetchx/fetcher-helper';

import {
  TFetcherSseConfigHeaders
} from '../types';

export default function getFinalHeaders(configHeaders?: TFetcherSseConfigHeaders, optionsHeaders?: FetcherHeaders): FetcherHeaders | undefined {
  if (!configHeaders && !optionsHeaders) {
    return;
  }
  
  if (!configHeaders) {
    return optionsHeaders;
  }
  
  const headers = typeof configHeaders === 'function' ? configHeaders() : configHeaders;
  
  return optionsHeaders ? headersMerge(headers, optionsHeaders) : headers;
}
