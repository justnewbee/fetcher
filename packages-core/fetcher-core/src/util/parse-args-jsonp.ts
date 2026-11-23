import {
  FetcherParams
} from '@fetchx/fetcher-helper';

import {
  TFetcherConfigQuick,
  TFetcherArgsJsonp
} from '../types';

export default function parseArgsJsonp<P extends FetcherParams>(args: TFetcherArgsJsonp<P>): [TFetcherConfigQuick | undefined, url: string, P?] {
  let config: TFetcherConfigQuick | undefined;
  let url: string;
  let params: P | undefined;
  
  if (typeof args[0] === 'string') {
    [url, params] = args as [string, P?];
  } else {
    [config, url, params] = args as [TFetcherConfigQuick, string, P?];
  }
  
  return [config, url, params];
}
