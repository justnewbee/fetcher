/**
 * @vitest-environment jsdom
 */
import {
  describe,
  expect,
  test,
  beforeEach
} from 'vitest';
import fetchMock from 'fetch-mock';
import {
  JSDOM
} from 'jsdom';

import fetcher from '../src';

import {
  API_GET,
  API_POST,
  API_PUT,
  API_PATCH,
  API_DELETE
} from './const';
import {
  setupFetchMock
} from './util';

describe('methods', () => {
  beforeEach(setupFetchMock);
  
  test('standard', () => {
    void expect(fetcher.get(API_GET.url)).resolves.toEqual(API_GET.result);
    void expect(fetcher.post(API_POST.url, {
      str: 'a string',
      num: 1234,
      boo: true,
      arr: [1, '2', 33, {
        right: 'x'
      }]
    })).resolves.toEqual(API_POST.result);
    void expect(fetcher.put(API_PUT.url)).resolves.toEqual(API_PUT.result);
    void expect(fetcher.patch(API_PATCH.url)).resolves.toEqual(API_PATCH.result);
    void expect(fetcher.delete(API_DELETE.url)).resolves.toEqual(API_DELETE.result);
  });
  
  test('jsonp', async () => {
    const dom = new JSDOM('<!DOCTYPE html><html lang="en"><head><title>JsDom</title></head><body></body></html>', {
      resources: 'usable',
      runScripts: 'dangerously'
    });
    
    (global as Record<string, unknown>).window = dom.window;
    (global as Record<string, unknown>).document = dom.window.document;
    
    expect(await fetcher.jsonp('https://jsfiddle.net/echo/jsonp?who=boshit&love=wlp')).toEqual({
      who: 'boshit',
      love: 'wlp'
    });
    
    expect(fetchMock.callHistory.calls().length).toEqual(0); // 不会调用到 fetch
    
    dom.window.close();
  });
});
