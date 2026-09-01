import {
  FetcherConfig
} from '@fetchx/fetcher-core';

import {
  TIsSuccess,
  TGetString,
  TGetData
} from './common';

/**
 * 可以在调用 Fetcher 请求时，覆盖默认的设置以适应某些特殊的场景，从而避免必须多生 Fetcher 实例的尴尬
 */
export interface IFetcherConfigBiz {
  /**
   * 判断请求是否成功，默认 '200'（即 code 为 '200'）
   *
   * - `string` 与 `getCode` 得到的结果对比
   * - `boolean` 直接成功或失败
   * - `json => boolean` 根据原始 json 对象进行自定义判断
   */
  isSuccess?: TIsSuccess;
  /**
   * 提取最终需要的数据，默认 'data'
   *
   * - `string` 自定义数据字段，如 'DATA' 则表示获取 `json.DATA`
   * - `json => unknown` 从原始 json 对象进行自定义提取
   */
  getData?: TGetData;
  /**
   * 从数据中提取 code，默认 'code'
   *
   * - `string` 自定义数据字段，如 'CODE' 则表示获取 `json.CODE`
   * - `json => string` 从原始 json 对象进行自定义提取
   */
  getCode?: TGetString;
  /**
   * 从数据中提取错误 title，默认 'title'
   *
   * - `string` 自定义数据字段，如 'TITLE' 则表示获取 `json.TITLE`
   * - `json => string` 从原始 json 对象进行自定义提取
   */
  getTitle?: TGetString;
  /**
   * 从数据中提取错误信息，默认 'message'
   *
   * - `string` 自定义数据字段，如 'MESSAGE' 则表示获取 `json.MESSAGE`
   * - `json => string` 从原始 json 对象进行自定义提取
   */
  getMessage?: TGetString;
}

export interface IFetcherConfigAugmentedBiz extends FetcherConfig, IFetcherConfigBiz {}
