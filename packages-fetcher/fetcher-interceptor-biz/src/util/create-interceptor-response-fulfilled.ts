import _isPlainObject from 'lodash/isPlainObject';

import {
  FetcherErrorName,
  FetcherInterceptResponseFulfilled,
  createFetcherError
} from '@fetchx/fetcher-core';

import {
  TResponseResult,
  IFetcherInterceptorBizOptions,
  IFetcherConfigAugmentedBiz
} from '../types';

import isResponseSuccess from './is-response-success';
import getResponseData from './get-response-data';
import getResponseCode from './get-response-code';
import getResponseTitle from './get-response-title';
import getResponseMessage from './get-response-message';

/**
 * 请求到这里，说明服务端有返回，但业务上不一定是成功的。
 * 这里会判断业务是否成功，如果成功则返回从原屎返回中得出的真正的数据，如果失败在抛出 FetchErrorBiz。
 */
export default function createInterceptorResponseFulfilled(options?: IFetcherInterceptorBizOptions): FetcherInterceptResponseFulfilled {
  return (o: unknown, config: IFetcherConfigAugmentedBiz): unknown => {
    if (!_isPlainObject(o)) { // 绕过非对象，比如 Blob、ArrayBuffer 等
      return o;
    }
    
    const result = o as TResponseResult;
    const code = getResponseCode(result, config.getCode ?? options?.getCode) || '__UNKNOWN__';
    const success = isResponseSuccess(result, code, config.isSuccess ?? options?.isSuccess);
    
    if (success) {
      return getResponseData(result, config.getData ?? options?.getData);
    }
    
    throw createFetcherError(config, {
      code,
      name: FetcherErrorName.BIZ,
      message: getResponseMessage(result, config.getMessage ?? options?.getMessage),
      title: getResponseTitle(result, config.getTitle ?? options?.getTitle)
    });
  };
}
