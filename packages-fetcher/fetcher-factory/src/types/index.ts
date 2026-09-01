import {
  Fetcher,
  FetcherHeaders,
  FetcherConfig
} from '@fetchx/fetcher';
import {
  FetcherInterceptorBizOptions,
  FetcherConfigBiz
} from '@fetchx/fetcher-interceptor-biz';
import {
  FetcherConfigCacheLocal
} from '@fetchx/fetcher-interceptor-cache-local';
import {
  FetcherConfigMerging
} from '@fetchx/fetcher-interceptor-merging';
import {
  FetcherInterceptorSlsOptions
} from '@fetchx/fetcher-interceptor-sls';
import {
  FetcherInterceptorLoginOptions
} from '@fetchx/fetcher-interceptor-login';

export interface IFetcherFactoryOptions {
  urlBase?: string;
  getHeaders?(): FetcherHeaders;
  interceptorMergingOptions?: boolean; // 暂时和 interceptorLogin 有冲突，默认不开启
  interceptorBizOptions?: FetcherInterceptorBizOptions;
  interceptorSlsOptions?: FetcherInterceptorSlsOptions;
  interceptorLoginOptions?: FetcherInterceptorLoginOptions;
}

export interface IFetcherSseFactoryOptions {
  urlBase?: string;
  getHeaders?(): Record<string, string>;
}

export interface IFetcherConfigX extends FetcherConfigBiz, FetcherConfigCacheLocal, FetcherConfigMerging {}

export interface IFetcherConfigAugmented extends FetcherConfig, IFetcherConfigX {}

export type TFetcher = Fetcher<IFetcherConfigX>;
