import {
  FetcherError
} from '@fetchx/fetcher-core';

export interface IFetcherInterceptorLoginOptions {
  needLogin: string | ((code: string, err: FetcherError) => boolean);
  doLogin(): Promise<unknown>;
}
