import factory, {
  Fetcher,
  FetcherConfigDefault
} from '@fetchx/fetcher-core';
import fetcherAdapterWeb from '@fetchx/fetcher-adapter-web';

export default function createFetcher<X extends object = object>(defaultConfig?: FetcherConfigDefault): Fetcher<X> {
  return factory<X>(fetcherAdapterWeb, defaultConfig);
}
