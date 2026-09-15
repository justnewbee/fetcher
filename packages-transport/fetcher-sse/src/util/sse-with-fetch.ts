import {
  createError,
  ensureError,
  decodeTextIntoSseChunks
} from '@fetchx/fetcher-helper';

import {
  ISseOptions
} from '../types';

export default function sseWithFetch(url: string, {
  withCredentials = true,
  headers,
  signal,
  onOpen,
  onChunk
}: ISseOptions = {}): Promise<void> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  
  return fetch(url, {
    credentials: withCredentials ? 'include' : 'omit',
    headers: {
      ...headers as object,
      Accept: 'text/event-stream'
    },
    signal
  }).then((response): Promise<void> => {
    if (response.status !== 200) {
      throw createError(`[sseWithFetch] Status: ${response.status}`);
    }
    
    reader = response.body?.getReader();
    
    if (!reader) {
      throw createError('[sseWithFetch] No ReadableStreamReader from body'); // 一般来说不会出现此错误
    }
    
    onOpen?.();
    
    signal?.addEventListener('abort', () => {
      void reader?.cancel(); // https://bugzilla.mozilla.org/show_bug.cgi?id=1583815
    }, {
      once: true
    });
    
    // 建立链接后，AbortController 就不会让 fetch 报错，而是让 reader 提前结束
    return new Promise<void>((resolve, reject) => {
      function readNext(): void {
        reader?.read().then(result => {
          if (result.done) {
            resolve();
          } else {
            if (onChunk) {
              decodeTextIntoSseChunks(result.value).forEach(v => onChunk(v));
            }
            
            readNext();
          }
        }).catch((err: unknown) => {
          reject(ensureError(err));
        });
      }
      
      readNext();
    });
  });
}
