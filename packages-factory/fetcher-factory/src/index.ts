export { default } from './fetcher-factory';
export { default as fetcherSseFactory } from './fetcher-sse-factory';
export { default as fetcherSetup } from './fetcher-setup';

export * from '@fetchx/fetcher-core'; // eslint-disable-line import/export
export * from '@fetchx/fetch-sse';

export type {
  IFetcherFactoryOptions as FetcherFactoryOptions,
  IFetcherConfigAugmented as FetcherConfig, // eslint-disable-line import/export
  TFetcher as Fetcher // eslint-disable-line import/export
} from './types';
