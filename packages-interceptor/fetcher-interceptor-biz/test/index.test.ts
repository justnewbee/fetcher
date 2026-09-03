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

import factory from '@fetchx/fetcher-core';
import fetcherAdapterWeb from '@fetchx/fetcher-adapter-web';

import intercept from '../src';

const fetcher = factory(fetcherAdapterWeb);

intercept(fetcher);

describe('fetcherInterceptorBiz', () => {
  beforeEach(() => {
    fetchMock.clearHistory();
    fetchMock.removeRoutes();
    fetchMock.mockGlobal();
    
    fetchMock.get('/api/get', () => ({
      code: '200',
      data: 'hello get'
    }));
    fetchMock.post('/api/post', () => ({
      code: 200,
      data: 'hello post'
    }));
    fetchMock.put('/api/put', () => ({
      code: 200,
      data: 'hello put'
    }));
    fetchMock.delete('/api/delete', () => ({
      code: 200,
      data: 'hello delete'
    }));
    
    fetchMock.route('/api/custom-data', () => ({
      code: 200,
      DATA: 'hello custom data'
    }));
    fetchMock.route('/api/custom-success', () => ({
      data: 'hello custom success'
    }));
    fetchMock.route('/api/custom-success-2', () => ({
      ok: true,
      data: 'hello custom success 2'
    }));
    
    fetchMock.route('/api/custom-my', () => ({
      code: 0,
      info: 'hello custom my'
    }));
    
    fetchMock.route('/api/error', () => ({
      code: 'SomethingWentWrong',
      data: 'hello world'
    }));
    fetchMock.route('/api/error-num', () => ({
      code: 1000123,
      data: 'hello world'
    }));
  });
  
  test('data will be extracted', () => {
    void expect(fetcher.get('/api/get')).resolves.toEqual('hello get');
    void expect(fetcher.post('/api/post')).resolves.toEqual('hello post');
    void expect(fetcher.put('/api/put')).resolves.toEqual('hello put');
    void expect(fetcher.delete('/api/delete')).resolves.toEqual('hello delete');
  });
  
  test('custom data', () => {
    void expect(fetcher.get({
      getData: 'DATA'
    }, '/api/custom-data')).resolves.toEqual('hello custom data');
  });
  
  test('custom success', () => {
    void expect(fetcher.get({
      isSuccess: true
    }, '/api/custom-success')).resolves.toEqual('hello custom success');
    
    void expect(fetcher.get({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isSuccess: o => o.ok === true
    }, '/api/custom-success-2')).resolves.toEqual('hello custom success 2');
    
    void expect(fetcher.get({
      isSuccess: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      getData: o => o
    }, '/api/custom-data')).resolves.toEqual({
      code: 200,
      DATA: 'hello custom data'
    });
  });
  
  test('error', () => {
    void expect(fetcher.get('/api/error')).rejects.toHaveProperty('code', 'SomethingWentWrong');
    void expect(fetcher.get('/api/error')).rejects.toHaveProperty('name', 'FetcherError.Biz');
    void expect(fetcher.get('/api/error-num')).rejects.toHaveProperty('code', '1000123');
  });
  
  test('custom when create fetcher', () => {
    const myFetcher = factory(fetcherAdapterWeb);
    
    intercept(myFetcher, {
      isSuccess: o => o.code === 0,
      getData: 'info'
    });
    
    void expect(myFetcher.get('/api/custom-my')).resolves.toEqual('hello custom my');
    void expect(myFetcher.get('/api/get')).rejects.toHaveProperty('code', '200');
  });
});
