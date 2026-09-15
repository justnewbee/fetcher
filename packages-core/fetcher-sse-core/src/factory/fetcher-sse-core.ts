import {
  PromiseWithAbort,
  urlBuild,
  urlMergeWithBase,
  makePromiseWithAbort
} from '@fetchx/fetcher-helper';

import {
  IFetcherSse,
  TFetcherSseAdapter,
  IFetcherSseConfig,
  TFetcherSseConfigHeaders,
  IFetcherSseRequestOptions
} from '../types';
import {
  getFinalHeaders
} from '../util';

export default class FetcherSseCore implements IFetcherSse {
  private frozen = false;
  
  constructor(private adapter?: TFetcherSseAdapter, private readonly defaultConfig: IFetcherSseConfig = {}) {}
  
  freeze(): void {
    this.frozen = true;
  }
  
  setAdapter(adapter: TFetcherSseAdapter): void {
    this.assertNotFrozen('setup');
    this.adapter = adapter;
  }
  
  setUrlBase(urlBase: string): void {
    this.assertNotFrozen('setUrlBase');
    this.defaultConfig.urlBase = urlBase;
  }
  
  setHeaders(headers: TFetcherSseConfigHeaders): void {
    this.assertNotFrozen('setHeaders');
    this.defaultConfig.headers = headers;
  }
  
  request(url: string, options: IFetcherSseRequestOptions = {}): PromiseWithAbort {
    const {
      adapter,
      defaultConfig
    } = this;
    
    if (!adapter) {
      throw new Error('[FetcherSse#request] Adapter is not set, either .setAdapter(adapter) or use constructor adapter arg.');
    }
    
    const {
      urlBase = defaultConfig.urlBase,
      params,
      withCredentials = true,
      headers,
      ...restOptions
    } = options;
    const abortController = new AbortController();
    const sseUrl = urlMergeWithBase(urlBuild(url, params), urlBase);
    
    return makePromiseWithAbort(adapter(sseUrl, getFinalHeaders(defaultConfig.headers, headers), {
      withCredentials,
      ...restOptions,
      signal: abortController.signal
    }), abortController);
  }
  
  private assertNotFrozen(fn: string): void {
    if (this.frozen) {
      throw new Error(`[Fetcher#${fn}] This FetcherSse instance is frozen.`);
    }
  }
}
