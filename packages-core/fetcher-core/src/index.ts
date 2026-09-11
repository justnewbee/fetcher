export { default } from './factory';

export * from '@fetchx/fetcher-helper';

export * from './helper';

export {
  EFetcherErrorName as FetcherErrorName,
  EFetcherResponseType as FetcherResponseType
} from './enum';

export type {
  IFetcher as Fetcher,
  TFetcherAdapter as FetcherAdapter,
  // common
  IPromiseWithAbort as PromiseWithAbort,
  // config
  IFetcherConfig as FetcherConfig,
  IFetcherConfigDefault as FetcherConfigDefault,
  TFetcherConfigQuickJsonp as FetcherConfigQuickJsonp,
  TFetcherConfigQuick as FetcherConfigQuick,
  // method
  TFetcherFnRequest as FetcherCallRequest,
  IFetcherFnJsonp as FetcherCallJsonp,
  IFetcherFnGet as FetcherCallGet,
  IFetcherFnPost as FetcherCallPost,
  // interceptor
  TFetcherInterceptRequest as FetcherInterceptRequest,
  TFetcherInterceptRequestReturn as FetcherInterceptRequestReturn,
  TFetcherInterceptResponseFulfilled as FetcherInterceptResponseFulfilled,
  TFetcherInterceptResponseRejected as FetcherInterceptResponseRejected,
  // response & error
  IFetcherResponse as FetcherResponse,
  IFetcherError as FetcherError
} from './types';
