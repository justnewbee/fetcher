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
    const instances: MockEventSource[] = [];

    defineGlobalEventSource(instances);

    const promise = fetcherSse(URL);

    expect(instances).toHaveLength(1);
    expect(promise).toBeInstanceOf(Promise);
  });

  test('uses fetch when headers are provided', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());

    void fetcherSse(URL, {
      headers: {
        Authorization: 'Bearer token'
      }
    });

    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer token'
      }) as Record<string, string>
    }));
  });

  test('uses fetch when preferEventSource is false', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());

    void fetcherSse(URL, undefined, false);

    expect(fetchSpy).toHaveBeenCalled();
  });

  test('passes signal to fetch', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());
    const abortController = new AbortController();

    void fetcherSse(URL, {
      signal: abortController.signal
    }, false);

    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      signal: abortController.signal
    }));
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

    void sseWithEventSource(URL, {
      onOpen
    });

    instances[0]?.emit('open', new Event('open'));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  test('calls onChunk with message data', () => {
    const onChunk = vi.fn();

    void sseWithEventSource(URL, {
      onChunk
    });

    instances[0]?.emit('message', new MessageEvent('message', {
      data: 'hello'
    }));

    expect(onChunk).toHaveBeenCalledWith('hello');
  });

  test('ignores message events with non-string data', () => {
    const onChunk = vi.fn();

    void sseWithEventSource(URL, {
      onChunk
    });

    instances[0]?.emit('message', new MessageEvent('message', {
      data: null
    } as MessageEventInit));

    expect(onChunk).not.toHaveBeenCalled();
  });

  test('rejects when connection failed', async () => {
    const promise = sseWithEventSource(URL);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    instances[0]!.readyState = instances[0]!.CLOSED;
    instances[0]?.emit('error', new Event('error'));

    await expect(promise).rejects.toThrow('[sseWithEventSource] EventSource connection failed');
  });

  test('resolves and closes connection on normal completion', async () => {
    const promise = sseWithEventSource(URL);

    instances[0]?.emit('error', new Event('error'));

    await expect(promise).resolves.toBeUndefined();
    expect(instances[0]?.readyState).toBe(instances[0]?.CLOSED);
  });

  test('abort rejects with AbortError and closes connection', async () => {
    const abortController = new AbortController();
    const promise = sseWithEventSource(URL, {
      signal: abortController.signal
    });

    abortController.abort();

    const error = await promise.catch((e: unknown) => e);

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toBe('AbortError');
    expect((error as Error).message).toBe('[sseWithEventSource] EventSource aborted');
    expect(instances[0]?.readyState).toBe(instances[0]?.CLOSED);
  });

  test('abort after connection closed leaves promise pending', async () => {
    const abortController = new AbortController();
    const promise = sseWithEventSource(URL, {
      signal: abortController.signal
    });

    instances[0]?.close();
    abortController.abort();

    const onSettled = vi.fn();

    void promise.then(onSettled, onSettled);
    await flushPromises();
    expect(onSettled).not.toHaveBeenCalled();
  });

  test('passes withCredentials option', () => {
    void sseWithEventSource(URL, {
      withCredentials: false
    });

    expect(instances[0]?.withCredentials).toBe(false);
  });
});

describe('sseWithFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('resolves after stream completes, calling onOpen and onChunk', async () => {
    const onOpen = vi.fn();
    const onChunk = vi.fn();
    const response = createMockResponse([
      'data: hello\n',
      'data: world\n'
    ]);

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);

    const promise = sseWithFetch(URL, {
      onOpen,
      onChunk
    });

    await expect(promise).resolves.toBeUndefined();
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, ' hello');
    expect(onChunk).toHaveBeenNthCalledWith(2, ' world');
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

    void sseWithFetch(URL, {
      onChunk
    });

    await response.done;
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, ' first');
    expect(onChunk).toHaveBeenNthCalledWith(2, ' second');
  });

  test('resolves without onChunk when stream has data', async () => {
    const response = createMockResponse(['data: hello\n']);

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);

    const promise = sseWithFetch(URL);

    await expect(promise).resolves.toBeUndefined();
  });

  test('rejects on non-200 status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {
      status: 500
    }));

    const promise = sseWithFetch(URL);

    await expect(promise).rejects.toThrow('[sseWithFetch] Status: 500');
  });

  test('rejects when body has no reader', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {
      status: 200
    }));

    const promise = sseWithFetch(URL);

    await expect(promise).rejects.toThrow('[sseWithFetch] No ReadableStreamReader from body');
  });

  test('rejects when reading the stream fails', async () => {
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.error(new Error('read failed'));
      }
    });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(stream, {
      status: 200
    }));

    const promise = sseWithFetch(URL);

    await expect(promise).rejects.toThrow('read failed');
  });

  test('abort cancels the reader and resolves the promise', async () => {
    const response = createMockResponse([], {
      hang: true
    });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    const abortController = new AbortController();

    const promise = sseWithFetch(URL, {
      signal: abortController.signal
    });

    await flushPromises();

    abortController.abort();

    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      signal: abortController.signal
    }));
    expect(response.readerCancel).toHaveBeenCalled();
    await expect(promise).resolves.toBeUndefined();
  });

  test('abort after stream completed keeps the resolved result', async () => {
    const response = createMockResponse([]);

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);

    const abortController = new AbortController();
    const promise = sseWithFetch(URL, {
      signal: abortController.signal
    });

    await expect(promise).resolves.toBeUndefined();

    abortController.abort();

    await expect(promise).resolves.toBeUndefined();
  });

  test('uses include credentials by default', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());

    void sseWithFetch(URL);

    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      credentials: 'include'
    }));
  });

  test('uses omit credentials when withCredentials is false', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());

    void sseWithFetch(URL, {
      withCredentials: false
    });

    expect(fetchSpy).toHaveBeenCalledWith(URL, expect.objectContaining({
      credentials: 'omit'
    }));
  });

  test('merges custom headers with Accept header', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(createMockResponse());

    void sseWithFetch(URL, {
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
