import {
  FetcherHeadersNormalized,
  FetcherBodyNormalized
} from '@fetchx/fetcher-helper';

import {
  TFetcherConfigX
} from './config';
import {
  IFetcherResponse
} from './fetcher-response';
import {
  TInterceptorEject,
  TFetcherInterceptRequest,
  TFetcherInterceptResponseFulfilled,
  TFetcherInterceptResponseRejected
} from './fetcher-interceptor';
import {
  IFetcherFnJsonp,
  IFetcherFnJsonpWithAbort,
  IFetcherFnGet,
  IFetcherFnGetWithAbort,
  IFetcherFnPost,
  IFetcherFnPostWithAbort
} from './fetcher-fn';

/**
 * 真正调用 adapter 执行网络请求前，Fetcher 会处理好完整的请求地址、标准的 Headers 和标准的 body（有的话），adapter 只需要安心使用即可
 */
export type TFetcherAdapter = <T>(url: string, headers: FetcherHeadersNormalized, body: FetcherBodyNormalized, config: TFetcherConfigX) => Promise<IFetcherResponse<T>>;

export interface IFetcherClass<X = object> {
  /**
   * 对于「开箱即用」的 Fetcher 实例，由于是会被复用的单例，一般不希望它被扩展和修改，此操作不可逆
   */
  freeze(): void;
  
  /**
   * 替换 `adapter`，让同一个业务级别的 `Fetcher` 实例得以适用于不同环境
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  setAdapter(adapter: TFetcherAdapter): void;
  
  /**
   * 替换 `defaultConfig.urlBase`，注意优先级低于拦截器设置的 `urlBase`
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  setUrlBase(urlBase: string): void;
  
  /**
   * 添加「预设」请求拦截器，返回解除拦截的无参方法
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  interceptRequest(onFulfilled: TFetcherInterceptRequest, priority?: number): TInterceptorEject;
  
  /**
   * 添加「预设」响应拦截器，返回解除拦截的无参方法
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  interceptResponse(onFulfilled?: TFetcherInterceptResponseFulfilled, onRejected?: TFetcherInterceptResponseRejected, priority?: number): TInterceptorEject;
  
  /**
   * 发送请求：前置请求拦截器 → 网络请求 → 后置响应拦截器
   */
  request<T = unknown>(config: TFetcherConfigX<X>): Promise<T>;
}

export interface IFetcher<X = object> extends Pick<IFetcherClass<X>, 'request' | 'setAdapter' | 'setUrlBase' | 'interceptRequest' | 'interceptResponse' | 'freeze'> {
  jsonp: IFetcherFnJsonp<X>;
  get: IFetcherFnGet<X>;
  post: IFetcherFnPost<X>;
  put: IFetcherFnPost<X>;
  patch: IFetcherFnPost<X>;
  delete: IFetcherFnPost<X>;
  withAbort: {
    jsonp: IFetcherFnJsonpWithAbort<X>;
    get: IFetcherFnGetWithAbort<X>;
    post: IFetcherFnPostWithAbort<X>;
    put: IFetcherFnPostWithAbort<X>;
    patch: IFetcherFnPostWithAbort<X>;
    delete: IFetcherFnPostWithAbort<X>;
  };
}
