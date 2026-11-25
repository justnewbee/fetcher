import {
  request
} from '@tarojs/taro';
import {
  FetcherHeaders,
  createError,
  createAbortError,
  decodeTextIntoSseChunks,
  headersNormalizeToPlain
} from '@fetchx/fetcher-helper';
import {
  FetcherSseAdapterOptions
} from '@fetchx/fetcher-sse-core';

/**
 * Taro SSE 适配器
 */
export default function fetcherSseAdapterTaro(url: string, headers?: FetcherHeaders, options: FetcherSseAdapterOptions = {}): Promise<void> { // satisfy FetcherSseAdapter
  return new Promise<void>((resolve, reject) => {
    const {
      withCredentials,
      signal,
      onOpen,
      onChunk
    } = options;
    
    if (signal?.aborted) {
      reject(createAbortError('[fetcherSseAdapterTaro] Aborted before even call'));
      
      return;
    }
    
    let settled = false;
    let removeAbortListener = (): void => undefined;
    
    function settle(error?: Error): void {
      if (settled) {
        return;
      }
      
      settled = true;
      removeAbortListener();
      
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }
    
    const requestTask = request<ArrayBufferLike>({
      url,
      method: 'GET',
      header: headersNormalizeToPlain(headers),
      enableChunked: true,
      responseType: 'arraybuffer',
      credentials: withCredentials ? 'include' : 'omit',
      success: result => {
        if (result.statusCode < 200 || result.statusCode >= 300) {
          settle(createError(`流式请求失败（${result.statusCode}）`));
          
          return;
        }
        
        settle();
      },
      fail: result => settle(createError(result.errMsg || '流式请求失败'))
    });
    
    const handleAbort = (): void => {
      requestTask.abort();
      settle(createAbortError('[fetcherSseAdapterTaro] Aborted by user.'));
    };
    
    if (signal) {
      signal.addEventListener('abort', handleAbort, {
        once: true
      });
      removeAbortListener = () => signal.removeEventListener('abort', handleAbort);
    }
    
    requestTask.onHeadersReceived(() => {
      try {
        onOpen?.();
      } catch (err) {
        requestTask.abort();
        settle(err as Error);
      }
    });
    requestTask.onChunkReceived(({
      data
    }) => {
      try {
        decodeTextIntoSseChunks(data).forEach(chunk => onChunk?.(chunk));
      } catch (err) {
        requestTask.abort();
        settle(err as Error);
      }
    });
  });
}
