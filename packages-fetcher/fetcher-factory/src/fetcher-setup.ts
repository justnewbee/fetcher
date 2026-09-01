import interceptHeaders from '@fetchx/fetcher-interceptor-headers';
import interceptMerging from '@fetchx/fetcher-interceptor-merging';
import interceptSls from '@fetchx/fetcher-interceptor-sls';
import interceptLogin from '@fetchx/fetcher-interceptor-login';

import {
  TFetcher,
  IFetcherFactoryOptions
} from './types';

/**
 * 允许对 Fetcher 进行设置，有些拦截器需要考虑多环境，可能根据业务不同而不同，
 * 有些则是在初始化时不方便设置（比如登录有可能造成循环依赖），通常此操作在
 * 应用启动时进行，且默认只允许执行一次，因此执行完会默认封禁拦截器扩展
 */
export default function fetcherSetup(fetcher: TFetcher, {
  urlBase,
  getHeaders,
  interceptorMergingOptions,
  interceptorSlsOptions,
  interceptorLoginOptions
}: Omit<IFetcherFactoryOptions, 'interceptorBizOptions'>, freeze = true): void {
  if (urlBase) {
    fetcher.interceptRequest(() => ({
      urlBase
    }));
  }
  
  if (getHeaders) {
    interceptHeaders(fetcher, getHeaders);
  }
  
  if (interceptorMergingOptions) { // FIXME 跟 interceptor-login 冲突，启用需谨慎
    interceptMerging(fetcher);
  }

  if (interceptorSlsOptions) {
    interceptSls(fetcher, interceptorSlsOptions);
  }
  
  if (interceptorLoginOptions) {
    interceptLogin(fetcher, interceptorLoginOptions);
  }
  
  if (freeze) {
    fetcher.freeze(); // 不要多次 setup
  }
}
