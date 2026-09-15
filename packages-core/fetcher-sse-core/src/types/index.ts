import {
  FetcherHeaders,
  FetcherParams,
  PromiseWithAbort
} from '@fetchx/fetcher-helper';

export interface IFetcherSseAdapterOptions {
  withCredentials?: boolean;
  signal?: AbortSignal | null;
  onOpen?(): void;
  onChunk?(chunk: string): void;
}

export interface IFetcherSseRequestOptions extends Omit<IFetcherSseAdapterOptions, 'signal'> {
  urlBase?: string;
  params?: FetcherParams;
  headers?: FetcherHeaders;
}

export type TFetcherSseConfigHeaders = FetcherHeaders | (() => FetcherHeaders);

export interface IFetcherSseConfig {
  urlBase?: string;
  headers?: TFetcherSseConfigHeaders;
}

export type TFetcherSseAdapter = (url: string, headers?: FetcherHeaders, options?: IFetcherSseAdapterOptions) => Promise<void>;

export interface IFetcherSse {
  /**
   * 避免多次调用 `setAdapter` 造成混乱
   */
  freeze(): void;
  
  /**
   * 替换 `adapter`，让同一个业务级别的 `FetcherSse` 实例得以适用于不同环境
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  setAdapter(adapter: TFetcherSseAdapter): void;
  
  /**
   * 替换 `defaultConfig.urlBase`
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  setUrlBase(urlBase: string): void;
  
  /**
   * 替换 `defaultConfig.headers`（这里没有拦截器，简单来）
   *
   * 🥶 实例 freeze 后调用会 throw
   */
  setHeaders(headers: TFetcherSseConfigHeaders): void;
  
  /**
   * 执行 SSE 请求
   */
  request(url: string, options?: IFetcherSseRequestOptions): PromiseWithAbort;
}
