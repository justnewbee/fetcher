/**
 * @vitest-environment jsdom
 */
import {
  describe,
  expect,
  test,
  beforeEach
} from 'vitest';

import fetcher, {
  FetcherErrorName
} from '../src';

import {
  API_STATUS_200,
  API_STATUS_201,
  API_STATUS_255,
  API_STATUS_299,
  API_STATUS_300,
  API_STATUS_404,
  API_STATUS_500,
  API_ABORT,
  API_TIMEOUT
} from './const';
import {
  setupFetchMock
} from './util';

describe('fetcher error', () => {
  beforeEach(setupFetchMock);
  
  test('status 200-299 ok, no data', () => {
    void expect(fetcher.get(API_STATUS_200.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_PARSE);
    void expect(fetcher.post(API_STATUS_201.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_PARSE);
    void expect(fetcher.put(API_STATUS_255.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_PARSE);
    void expect(fetcher.delete(API_STATUS_299.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_PARSE);
  });
  
  test('response status NOT 200', () => {
    void expect(fetcher.get(API_STATUS_300.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_STATUS);
    void expect(fetcher.get(API_STATUS_404.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_STATUS);
    void expect(fetcher.post(API_STATUS_500.url)).rejects.toHaveProperty('name', FetcherErrorName.RESPONSE_STATUS);
  });
  
  test('timeout', () => {
    void expect(fetcher.get({
      timeout: 100
    }, API_TIMEOUT.url)).rejects.toHaveProperty('name', FetcherErrorName.TIMEOUT);
  });
  
  test('abort', () => {
    const abortController = new AbortController();
    const promise = fetcher.post({
      signal: abortController.signal
    }, API_ABORT.url);
    
    void expect(promise).rejects.toThrow('The operation was aborted.');
    void expect(promise).rejects.toHaveProperty('name', 'AbortError');
    
    abortController.abort();
  });
});
