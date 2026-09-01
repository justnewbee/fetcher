import {
  FetcherError
} from '@fetchx/fetcher-core';

export interface IFetcherInterceptorLoginOptions {
  needLogin(code: string, err: FetcherError): boolean;
  doLogin(): Promise<unknown>;
}
