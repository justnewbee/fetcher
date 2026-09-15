export { default } from './fetcher-factory';
export { default as fetcherSetup } from './fetcher-setup';
export { default as fetcherSseFactory } from './fetcher-sse-factory';

export * from '@fetchx/fetcher-core'; // eslint-disable-line import/export
export * from '@fetchx/fetch-sse';

export type {
  TFetcher as Fetcher, // eslint-disable-line import/export
  IFetcherConfigAugmented as FetcherConfig, // eslint-disable-line import/export
  IFetcherFactoryOptions as FetcherFactoryOptions
} from './types';
