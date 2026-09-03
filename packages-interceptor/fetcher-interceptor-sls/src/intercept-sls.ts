import {
  Fetcher
} from '@fetchx/fetcher-core';
import {
  transport
} from '@fetchx/sls-logger-web';
import interceptSlsCore, {
  FetcherInterceptorSlsOptions
} from '@fetchx/fetcher-interceptor-sls-core';

export default function interceptSls(fetcher: Fetcher, options: FetcherInterceptorSlsOptions, priority?: number): () => void {
  return interceptSlsCore(fetcher, transport, options, priority);
}
