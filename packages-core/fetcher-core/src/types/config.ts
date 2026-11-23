import {
  FetcherHeaders,
  FetcherParams,
  FetcherBody,
  FetcherParamsSerializeOptions,
  FetcherBodySerializeOptions
} from '@fetchx/fetcher-helper';

import {
  EFetcherResponseType
} from '../enum';

interface IFetcherConfigCommon {
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 接口 URL，若非绝对地址，将与 urlBase 结合使用
   */
  url?: string;
  /**
   * 如果指定 `urlBase` 且 `url` 不是绝对路径，会将两者拼接起来
   *
   * 注意 `urlBase` 和 `url` 之间不会被自动拼上 `/`，可认为它只是一个前缀
   */
  urlBase?: string;
  /**
   * 是否在 url 上拼接 `_cache_busting_` 参数，值用的是时间戳
   *
   * 注意：绝大所述情况下用不到，后端一般应返回响应头 `Cache-Control: no-store`
   */
  urlCacheBusting?: boolean;
  /**
   * - 支持除了标准 HTTP 请求的 GET/POST/DELETE/PUT/PATCH + JSONP
   * - 大小写无关，但内部一开始就会转成大写，建议统一用大写
   * - 不要手动调用 HEAD/OPTIONS/TRACE
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   */
  method?: string;
  /**
   * URL search 参数，纯的 `fetch/jsonp` 的 url 要求是已经拼接好参数的 url
   *
   * `{ url: '/url', params: { a: 1, b: 2} }` 等价于 `{ url: '/url', params: 'a=1&b=2' }` 等价于 `{ url: '/url?a=1&b=2' }`
   */
  params?: FetcherParams;
  /**
   * POST/PUT/DELETE 等请求体
   */
  body?: FetcherBody;
  /**
   * 请求头
   */
  headers?: FetcherHeaders;
  /**
   * 如果传入的 `params` 是对象，用 `qs` 来序列化它的参数
   */
  serializeParams?: FetcherParamsSerializeOptions;
  /**
   * 自定义 `body` 的 serialize
   */
  serializeBody?: FetcherBodySerializeOptions;
  /**
   * 同 fetch 的 credentials
   */
  credentials?: RequestCredentials;
  /**
   * 允许 abort，需要你自己 `new AbortController`，推荐直接用 `fetcher.withAbort.get|post|delete|...`，以下两个代码片段功能等价
   *
   * 1. 自己 new AbortController
   *
   * ```ts
   * const abortController = new AbortController();
   * const promise = fetcher.get({
   *   signal: abortController.signal
   * }, url);
   *
   * abortController.abort();
   * ```
   *
   * 2. 使用 `fetcher.withAbort.get|post|delete|...`
   *
   * ```ts
   * const promise = fetcher.withAbort.get(url); // 注意这里不能 `.then` 否则将变成本源 Promise
   *
   * promise.abort();
   * ```
   */
  signal?: AbortSignal | null;
  /**
   * 对返回数据的处理，默认 `'json'`
   */
  responseType?: EFetcherResponseType | `${EFetcherResponseType}`;
  // 特殊 - 下载
  /**
   * 当 responseType 为 `blob-download`、`array-buffer-download` 时，可用它指定下载的文件名（无后缀）
   */
  downloadName?: string;
  // 特殊 - 上传进度
  /**
   * 上传文件的情况，底层只能用 xhr 来获取进度
   */
  onProgress?(progress: number): void; // progress 范围 [0, 1]
}

/**
 * `_` 打头的是 fetcher 自己填入的，不要在调用时传入
 */
interface IFetcherConfigInternal {
  /**
   * 调用 `request` 时传入的原初 `config`，可在「重试」拦截中使用以避免污染
   */
  _config?: IFetcherConfigCommon;
  /**
   * 根据 `method`、`url`、`urlBase`、`params`、`body` 计算得到的 MD5，可以被拦截器使用，比如缓存、合并时需要
   */
  _hash?: string;
  /**
   * 真正开始请求的时间，由最末一个 interceptor 计入，便于需要记录耗时的场景
   */
  _timeStarted?: number;
  /**
   * 标注在 Fetcher 内部由拦截器发起的二次请求
   */
  _byInterceptor?: boolean;
}

/**
 * 特殊 - JSONP，当 method: 'JSONP' 时
 */
interface IFetcherConfigJsonp {
  jsonpCharset?: string;
  jsonpCallback?: string;
  jsonpCallbackFunction?: string;
}

/**
 * `new Fetcher` 时的 config，用于定义默认值，在执行请求时，将被传入的 config 混合
 */
export interface IFetcherConfigDefault extends Pick<IFetcherConfigCommon, 'timeout' | 'urlBase' | 'headers' | 'serializeParams' | 'serializeBody' | 'responseType'> {}

/**
 * Interceptor 的 config 参数，也是 Fetcher.prototype.request 的参数
 */
export interface IFetcherConfig extends IFetcherConfigCommon, IFetcherConfigInternal, IFetcherConfigJsonp {}

/**
 * 其他便捷方法，如果第一个参数为对象，则为 config
 */
export type TFetcherConfigQuick<X = object> = Omit<IFetcherConfigCommon, 'url' | 'method'> & X;

/**
 * 便捷 JSONP 方法，如果第一个参数为对象，则为 config
 */
export type TFetcherConfigQuickJsonp<X = object> = Omit<IFetcherConfigCommon, 'url' | 'method'> & IFetcherConfigJsonp & X;

/**
 * 允许拦截器对 FetcherConfig 进行扩展，在便捷方法和拦截器上可以安全使用扩展后的属性
 */
export type TFetcherConfigX<X = object> = IFetcherConfig & X;
