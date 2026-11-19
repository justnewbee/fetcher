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
  /**
   * 执行登录逻辑，有以下场景：
   *
   * 1. 弹窗登录，一般在登录成功之前是不应该被关闭或取消的，但若真允许取消，需要 `throw`
   * 2. 不弹窗，而是跳转到登录页，一定要 `throw`，否则会认为登录成功
   *
   * `throw` 什么不重要，因为代码中不会关心，拦截器会修改原始 Error 的名称为 `FetcherErrorName.LOGIN_CANCELLED`
   */
  doLogin(): Promise<unknown>;
  /**
   * 执行 `doLogin` 成功时的回调，可统一处理一些副作用
   */
  onLoginSuccess?(loginResult: unknown): void;
}
