import {
  FetcherError
} from '@fetchx/fetcher-core';

export interface IFetcherInterceptorLoginOptions {
  /**
   * 什么情况触发登录拦截器，如果设置的是字符串，则表示 error.code 等于该字符串时触发，
   * 比如 `needLogin: '401'` 表示 error.code 等于 401 时将触发登录拦截器
   *
   * 如果需要忽略特殊某些接口，可以用 ignore 参数，如果有更复杂的场景，再用方法
   */
  needLogin: string | ((code: string, err: FetcherError) => boolean);
  /**
   * 忽略哪个或哪些接口，这里的字符串将与 `config.url` 做比较，必须和调用时写的保持一致
   */
  ignore?: string | string[];
  doLogin(): Promise<unknown>;
}
