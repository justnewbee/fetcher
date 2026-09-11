/**
 * @vitest-environment jsdom
 */
import {
  vi,
  describe,
  expect,
  test,
  afterEach,
  beforeEach
} from 'vitest';

import fetcherSse from '../src';
import {
  sseWithEventSource,
  sseWithFetch
} from '../src/util';

import {
  MockEventSource,
  defineGlobalEventSource,
  createMockResponse,
  flushPromises
} from './util';

const URL = '/api/sse';

describe('fetcherSse', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    defineGlobalEventSource();
  });
  
  test('prefers EventSource when no headers are provided', () => {
    const eventSourceSpy = vi.spyOn(globalThis, 'EventSource', 'get');
    
    eventSourceSpy.mockReturnValue(MockEventSource as unknown as typeof EventSource);
    
    const abort = fetcherSse(URL);
    
    expect(eventSourceSpy).toHaveBeenCalled();
    expect(typeof abort).toBe('function');
  });
  
  test('uses fetch when headers are provided', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());
    
    fetcherSse(URL, {
      headers: {
        Authorization: 'Bearer token'
      }
    });
    
    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer token'
      })
    }));
  });
  
  test('uses fetch when preferEventSource is false', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());
    
    fetcherSse(URL, undefined, false);
    
    expect(fetchSpy).toHaveBeenCalled();
  });
});

describe('sseWithEventSource', () => {
  let instances: MockEventSource[];
  
  beforeEach(() => {
    vi.restoreAllMocks();
    instances = [];
    defineGlobalEventSource(instances);
  });
  
  afterEach(() => {
    instances.forEach(instance => instance.close());
  });
  
  test('calls onOpen when connection opens', () => {
    const onOpen = vi.fn();
    
    sseWithEventSource(URL, {
      onOpen
    });
    
    instances[0].emit('open', new Event('open'));
    
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
  
  test('calls onChunk with message data', () => {
    const onChunk = vi.fn();
    
    sseWithEventSource(URL, {
      onChunk
    });
    
    instances[0].emit('message', new MessageEvent('message', {
      data: 'hello'
    }));
    
    expect(onChunk).toHaveBeenCalledWith('hello');
  });
  
  test('ignores message events with non-string data', () => {
    const onChunk = vi.fn();
    
    sseWithEventSource(URL, {
      onChunk
    });
    
    instances[0].emit('message', new MessageEvent('message', {
      data: null
    } as MessageEventInit));
    
    expect(onChunk).not.toHaveBeenCalled();
  });
  
  test('handles connection failure error', () => {
    const onError = vi.fn();
    const onClose = vi.fn();
    
    sseWithEventSource(URL, {
      onError,
      onClose
    });
    
    instances[0].readyState = instances[0].CLOSED;
    instances[0].emit('error', new Event('error'));
    
    expect(onError).toHaveBeenCalledWith(new Error('[sseWithEventSource] EventSource connection failed'));
    expect(onClose).toHaveBeenCalledWith('error');
  });
  
  test('handles normal completion error', () => {
    const onSuccess = vi.fn();
    const onClose = vi.fn();
    const onError = vi.fn();
    
    sseWithEventSource(URL, {
      onSuccess,
      onClose,
      onError
    });
    
    instances[0].emit('error', new Event('error'));
    
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('success');
    expect(onError).not.toHaveBeenCalled();
    expect(instances[0].readyState).toBe(instances[0].CLOSED);
  });
  
  test('abort closes connection and invokes callbacks', () => {
    const onAbort = vi.fn();
    const onClose = vi.fn();
    
    const abort = sseWithEventSource(URL, {
      onAbort,
      onClose
    });
    
    expect(abort()).toBe(true);
    expect(instances[0].readyState).toBe(instances[0].CLOSED);
    expect(onAbort).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('abort');
  });
  
  test('abort returns false when already closed', () => {
    const abort = sseWithEventSource(URL);
    
    instances[0].close();
    
    expect(abort()).toBe(false);
  });
  
  test('passes withCredentials option', () => {
    sseWithEventSource(URL, {
      withCredentials: false
    });
    
    expect(instances[0].withCredentials).toBe(false);
  });
});

describe('sseWithFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  
  test('calls onOpen, onChunk and onSuccess for successful stream', async () => {
    const onOpen = vi.fn();
    const onChunk = vi.fn();
    const onSuccess = vi.fn();
    const onClose = vi.fn();
    const response = createMockResponse([
      'data: hello\n',
      'data: world\n'
    ]);
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    
    const abort = sseWithFetch(URL, {
      onOpen,
      onChunk,
      onSuccess,
      onClose
    });
    
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
    
    expect(abort()).toBe(false); // already closed by success
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, ' hello', 0, [' hello']);
    expect(onChunk).toHaveBeenNthCalledWith(2, ' world', 0, [' world']);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('success');
  });
  
  test('ignores empty lines and retry lines', async () => {
    const onChunk = vi.fn();
    const response = createMockResponse([
      'data: first\n',
      '\n',
      'retry: 3000\n',
      'data: second\n'
    ]);
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    
    sseWithFetch(URL, {
      onChunk
    });
    
    await response.done;
    
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, ' first', 0, [' first']);
    expect(onChunk).toHaveBeenNthCalledWith(2, ' second', 0, [' second']);
  });
  
  test('handles non-200 status', async () => {
    const onError = vi.fn();
    const onClose = vi.fn();
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {
      status: 500
    }));
    
    sseWithFetch(URL, {
      onError,
      onClose
    });
    
    await flushPromises();
    
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      message: '[sseWithFetch] Status: 500'
    }));
    expect(onClose).toHaveBeenCalledWith('error');
  });
  
  test('handles missing body', async () => {
    const onError = vi.fn();
    const onClose = vi.fn();
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {
      status: 200
    }));
    
    sseWithFetch(URL, {
      onError,
      onClose
    });
    
    await flushPromises();
    
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      message: '[sseWithFetch] No ReadableStreamReader from body'
    }));
    expect(onClose).toHaveBeenCalledWith('error');
  });
  
  test('abort invokes callbacks', async () => {
    const onAbort = vi.fn();
    const onClose = vi.fn();
    const response = createMockResponse([], {
      hang: true
    });
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    
    const abort = sseWithFetch(URL, {
      onAbort,
      onClose
    });
    
    await flushPromises();
    
    expect(abort()).toBe(true);
    expect(response.readerCancel).toHaveBeenCalled();
    expect(onAbort).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('abort');
  });
  
  test('abort returns false when already closed', async () => {
    const onSuccess = vi.fn();
    const response = createMockResponse([]);
    
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    
    const abort = sseWithFetch(URL, {
      onSuccess
    });
    
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
    
    expect(abort()).toBe(false);
  });
  
  test('uses include credentials by default', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());
    
    sseWithFetch(URL);
    
    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      credentials: 'include'
    }));
  });
  
  test('uses omit credentials when withCredentials is false', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());
    
    sseWithFetch(URL, {
      withCredentials: false
    });
    
    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      credentials: 'omit'
    }));
  });
  
  test('merges custom headers with Accept header', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());
    
    sseWithFetch(URL, {
      headers: {
        'X-Custom': 'value'
      }
    });
    
    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      headers: {
        'X-Custom': 'value',
        Accept: 'text/event-stream'
      }
    }));
  });
});
