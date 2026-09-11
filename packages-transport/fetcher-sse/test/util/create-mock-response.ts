import {
  vi
} from 'vitest';

import {
  ICreateMockResponseOptions,
  ICreateMockResponseResult
} from '../types';

export default function createMockResponse(chunks: string[] = [], options: ICreateMockResponseOptions = {}): ICreateMockResponseResult {
  const encoder = new TextEncoder();
  let index = 0;
  let resolveDone: () => void;
  const readerCancel = options.readerCancel ?? vi.fn().mockResolvedValue(undefined);
  
  const done = new Promise<void>(resolve => {
    resolveDone = resolve;
  });
  
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (options.hang) {
        return new Promise(() => {
        });
      }
      
      if (index >= chunks.length) {
        controller.close();
        resolveDone();
        
        return;
      }
      
      controller.enqueue(encoder.encode(chunks[index]));
      index += 1;
    },
    cancel(reason: unknown) {
      readerCancel(reason);
      resolveDone();
      
      return Promise.resolve();
    }
  });
  
  const response = new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream'
    }
  });
  
  return Object.assign(response, {
    done,
    readerCancel
  });
}
