import {
  ISseOptions,
  TSseAbort
} from '../types';

export default function sseWithEventSource(url: string, {
  withCredentials = true,
  onOpen,
  onChunk,
  onSuccess,
  onError,
  onAbort,
  onClose
}: Omit<ISseOptions, 'headers'> = {}): TSseAbort {
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
  eventSource.addEventListener('error', () => {
    if (eventSource.readyState === eventSource.CLOSED) { // 无法连接
      const error = new Error('EventSource connection failed');
      
      onError?.(error);
      onClose?.('error');
    } else {
      eventSource.close(); // 否则 EventSource 会不断自动重连
      onSuccess?.();
      onClose?.('success');
    }
  });
  
  return (): boolean => {
    if (eventSource.readyState === eventSource.CLOSED) {
      return false;
    }
    
    eventSource.close(); // 不会额外触发 error 事件
    onAbort?.();
    onClose?.('abort');
    
    return true;
  };
}
