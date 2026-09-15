import factory, {
  FetcherSse
} from '@fetchx/fetcher-sse-core';
import fetcherSseAdapterWeb from '@fetchx/fetcher-sse-adapter-web';

import {
  IFetcherSseFactoryOptions
} from './types';

export default function fetcherSseFactory({
  adapter = fetcherSseAdapterWeb,
  urlBase,
  getHeaders
}: IFetcherSseFactoryOptions = {}): FetcherSse {
  return factory(adapter, {
    urlBase,
    headers: getHeaders
  });
}
