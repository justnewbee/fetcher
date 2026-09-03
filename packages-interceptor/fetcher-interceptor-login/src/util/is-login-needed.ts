import {
  FetcherError
} from '@fetchx/fetcher-core';

import {
  IFetcherInterceptorLoginOptions
} from '../types';

export default function isLoginNeeded(error: FetcherError, needLogin: IFetcherInterceptorLoginOptions['needLogin']): boolean {
  if (typeof needLogin === 'string') {
    return error.code === needLogin;
  }
  
  return needLogin(error.code ?? '', error);
}
