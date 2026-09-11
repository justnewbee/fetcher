import {
  FetcherParams,
  urlBuild,
  urlMergeWithBase
} from '@fetchx/fetcher-helper';
import fetcherSse, {
  SseOptions,
  SseAbort
} from '@fetchx/fetcher-sse';

interface IFetcherSseConfig {
  urlBase?: string;
  getHeaders?(): object;
}

interface IFetcherSse {
  request(url: string, params?: FetcherParams, options?: SseOptions): SseAbort;
  
  setup(adapter: typeof fetcherSse): void;
  
  freeze(): void;
}

export default class FetcherSse implements IFetcherSse {
  private frozen = false;
  
  constructor(private adapter?: typeof fetcherSse, private defaultConfig?: IFetcherSseConfig) {}
  
  request(url: string, params?: FetcherParams, options?: SseOptions): SseAbort {
    const adapter = this.adapter;
    
    if (!adapter) {
      throw new Error('[FetcherSse#request] Adapter is not set, either .setup(adapter) or use constructor adapter arg.');
    }
    
    const baseUrl = this.defaultConfig?.urlBase;
    const sseUrl = urlMergeWithBase(urlBuild(url, params), baseUrl);
    
    return adapter(sseUrl, options);
  }
  
  setup(adapter: typeof fetcherSse): void {
    this.assertNotFrozen('setup');
    this.adapter = adapter;
  }
  
  freeze(): void {
    this.frozen = true;
  }
  
  private assertNotFrozen(fn: string): void {
    if (this.frozen) {
      throw new Error(`[Fetcher#${fn}] This fetcher instance is frozen.`);
    }
  }
}
