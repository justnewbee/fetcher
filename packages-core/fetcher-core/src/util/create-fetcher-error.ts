import {
  ensureError
} from '@fetchx/fetcher-helper';

import {
  IErrorExtendedInfo,
  IFetcherConfig,
  IFetcherError
} from '../types';

interface IOptions extends IErrorExtendedInfo {
  originalError?: unknown;
  name?: string; // 不限定枚举
  message?: string;
}

export default function createFetcherError(config: IFetcherConfig, options: IOptions = {}): IFetcherError {
  const error = ensureError(options.originalError) as IFetcherError;
  
  error.config = config;
  
  if (options.name) {
    error.name = options.name;
  }
  
  if (options.message) {
    error.message = options.message;
  }
  
  if (options.title) {
    error.title = options.title;
  }
  
  if (options.code) {
    error.code = options.code;
  }
  
  if (options.responseHeaders) {
    error.responseHeaders = options.responseHeaders;
  }
  
  if (options.responseData) {
    error.responseData = options.responseData;
  }
  
  return error;
}
