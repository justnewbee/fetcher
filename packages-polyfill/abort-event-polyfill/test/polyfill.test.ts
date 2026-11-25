import assert from 'assert';

import {
  afterEach,
  describe,
  test,
  vi
} from 'vitest';

import polyfill, {
  AbortController,
  AbortSignal
} from '../src';

interface IAbortGlobal {
  AbortController?: unknown;
  AbortSignal?: unknown;
}

describe('polyfill', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  
  test('should install the shims onto globalThis when missing', () => {
    vi.stubGlobal('AbortController', undefined);
    vi.stubGlobal('AbortSignal', undefined);
    
    polyfill();
    
    const global = globalThis as IAbortGlobal;
    
    assert.strictEqual(global.AbortController, AbortController);
    assert.strictEqual(global.AbortSignal, AbortSignal);
  });
  
  test('should not overwrite existing implementations', () => {
    const ExistingAbortController = {
      name: 'ExistingAbortController'
    };
    
    vi.stubGlobal('AbortController', ExistingAbortController);
    vi.stubGlobal('AbortSignal', undefined);
    
    polyfill();
    
    const global = globalThis as IAbortGlobal;
    
    assert.strictEqual(global.AbortController, ExistingAbortController);
    assert.strictEqual(global.AbortSignal, AbortSignal);
  });
  
  test('should be idempotent', () => {
    vi.stubGlobal('AbortController', undefined);
    vi.stubGlobal('AbortSignal', undefined);
    
    polyfill();
    polyfill();
    
    const global = globalThis as IAbortGlobal;
    
    assert.strictEqual(global.AbortController, AbortController);
    assert.strictEqual(global.AbortSignal, AbortSignal);
  });
});
