import {
  ISseOptions,
  TSseAbort
} from '../types';

enum EReadyState {
  CONNECTING,
  OPEN,
  CLOSED
}

export default function sseWithFetch(url: string, {
  withCredentials = true,
  headers,
  onOpen,
  onChunk,
  onSuccess,
  onError,
  onAbort,
  onClose
}: ISseOptions = {}): TSseAbort {
  const abortController = new AbortController();
  let readyState = EReadyState.CONNECTING;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  
  void fetch(url, {
    credentials: withCredentials ? 'include' : 'omit',
    headers: {
      ...headers,
      Accept: 'text/event-stream'
    },
    signal: abortController.signal
  }).then((response): Promise<void> => {
    if (response.status !== 200) {
      throw new Error(`Status: ${response.status}`);
    }
    
    reader = response.body?.getReader();
    
    if (!reader) {
      throw new Error('No ReadableStreamReader from body'); // 一般来说不会出现此错误
    }
    
    readyState = EReadyState.OPEN;
    onOpen?.();
    
    const textDecoder = new TextDecoder();
    
    // 建立链接后，abortController 就不会让 fetch 报错，而是让 reader 提前结束
    return new Promise<void>((resolve, reject) => {
      function readNextChunk(): void {
        reader?.read().then(result => {
          if (result.done) {
            if (readyState !== EReadyState.CLOSED) { // CLOSED 表示已经 abort
              readyState = EReadyState.CLOSED;
              onSuccess?.();
              onClose?.('success');
            }
            
            resolve();
          } else {
            const text = textDecoder.decode(result.value);
            
            text.split('\n').forEach(v => {
              const chunk = v.replace(/^data:/, '');
              
              if (chunk.trim() && !chunk.startsWith('retry:')) {
                onChunk?.(chunk);
              }
            });
            
            readNextChunk();
          }
        }).catch((err: unknown) => {
          reject(err); // eslint-disable-line @typescript-eslint/prefer-promise-reject-errors
        });
      }
      
      readNextChunk();
    });
  }).catch((err: unknown) => {
    if (readyState === EReadyState.CLOSED) { // aborted
      return;
    }
    
    readyState = EReadyState.CLOSED;
    onError?.(err as Error);
    onClose?.('error');
    
    throw err;
  });
  
  return (): boolean => {
    if (readyState === EReadyState.CLOSED) { // success error aborted 都会成为 CLOSED
      return false;
    }
    
    readyState = EReadyState.CLOSED;
    void reader?.cancel(); // https://bugzilla.mozilla.org/show_bug.cgi?id=1583815
    abortController.abort();
    onAbort?.();
    onClose?.('abort');
    
    return true;
  };
}
