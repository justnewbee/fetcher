import {
  describe,
  test,
  expect,
  vi
} from 'vitest';

import {
  makePromiseWithAbort
} from '../src';

interface IDeferred<T> {
  promise: Promise<T>;
  resolve(value: T): void;
  reject(reason?: unknown): void;
}

function createDeferred<T>(): IDeferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return {
    promise,
    resolve,
    reject
  };
}

describe('makePromiseWithAbort', () => {
  test('returns a promise that resolves with the original value', async () => {
    const promiseWithAbort = makePromiseWithAbort(Promise.resolve(42), new AbortController());
    
    await expect(promiseWithAbort).resolves.toBe(42);
  });
  
  test('returns a promise that rejects with the original reason', async () => {
    const reason = new Error('boom');
    const promiseWithAbort = makePromiseWithAbort(Promise.reject(reason), new AbortController());
    
    await expect(promiseWithAbort).rejects.toBe(reason);
  });
  
  test('exposes an abort method on the returned promise', () => {
    const promiseWithAbort = makePromiseWithAbort(Promise.resolve(1), new AbortController());
    
    expect(promiseWithAbort).toBeInstanceOf(Promise);
    expect(typeof promiseWithAbort.abort).toBe('function');
  });
  
  test('aborts the controller and returns true while the promise is pending', () => {
    const deferred = createDeferred<number>();
    const abortController = new AbortController();
    const promiseWithAbort = makePromiseWithAbort(deferred.promise, abortController);
    
    expect(abortController.signal.aborted).toBe(false);
    expect(promiseWithAbort.abort()).toBe(true);
    expect(abortController.signal.aborted).toBe(true);
  });
  
  test('does not stop the promise from resolving after abort', async () => {
    const deferred = createDeferred<number>();
    const promiseWithAbort = makePromiseWithAbort(deferred.promise, new AbortController());
    
    promiseWithAbort.abort();
    deferred.resolve(42);
    
    await expect(promiseWithAbort).resolves.toBe(42);
  });
  
  test('returns false and does not abort the controller after the promise resolves', async () => {
    const abortController = new AbortController();
    const promiseWithAbort = makePromiseWithAbort(Promise.resolve(42), abortController);
    
    await promiseWithAbort;
    
    expect(promiseWithAbort.abort()).toBe(false);
    expect(abortController.signal.aborted).toBe(false);
  });
  
  test('returns false and does not abort the controller after the promise rejects', async () => {
    const abortController = new AbortController();
    const promiseWithAbort = makePromiseWithAbort(Promise.reject(new Error('boom')), abortController);
    
    await expect(promiseWithAbort).rejects.toThrow('boom');
    
    expect(promiseWithAbort.abort()).toBe(false);
    expect(abortController.signal.aborted).toBe(false);
  });
  
  test('only calls abort on the controller once the promise has settled', async () => {
    const deferred = createDeferred<number>();
    const abortController = new AbortController();
    const abortSpy = vi.spyOn(abortController, 'abort');
    const promiseWithAbort = makePromiseWithAbort(deferred.promise, abortController);
    
    expect(abortSpy).not.toHaveBeenCalled();
    
    promiseWithAbort.abort();
    
    expect(abortSpy).toHaveBeenCalledTimes(1);
    
    deferred.resolve(1);
    await promiseWithAbort;
  });
});
