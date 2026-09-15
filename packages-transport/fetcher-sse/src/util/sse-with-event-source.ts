import {
  createError
} from '@fetchx/fetcher-helper';

import {
  ISseOptions
} from '../types';

export default function sseWithEventSource(url: string, {
  withCredentials = true,
  signal,
  onOpen,
  onChunk
}: Omit<ISseOptions, 'headers'> = {}): Promise<void> {
  const eventSource = new EventSource(url, {
    withCredentials
  });
  
  eventSource.addEventListener('open', () => {
    onOpen?.();
  });
  eventSource.addEventListener('message', (e: MessageEvent<string>) => {
    const {
      data
    } = e;
    
    if (data && typeof data === 'string') {
      onChunk?.(data);
    }
  });
  
  return new Promise<void>((resolve, reject) => {
    eventSource.addEventListener('error', () => {
      if (eventSource.readyState === eventSource.CLOSED) { // 一般是无法连接，Error Event 里没什么有用信息
        const error = createError('[sseWithEventSource] EventSource connection failed');
        
        reject(error);
      } else {
        eventSource.close(); // 否则 EventSource 会不断自动重连
        resolve();
      }
    });
    
    signal?.addEventListener('abort', () => {
      if (eventSource.readyState === eventSource.CLOSED) {
        return;
      }
      
      eventSource.close();
      reject(createError('[sseWithEventSource] EventSource aborted', 'AbortError'));
    }, {
      once: true
    });
  });
}
