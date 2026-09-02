import {
  headersGet
} from '@fetchx/fetcher-helper-headers';

import {
  IFetcherResponse
} from '../types';

export default function getResponseHeader(response: IFetcherResponse, keys: string): string | null | undefined {
  return headersGet(response.headers, keys);
}
