import assert from 'assert';

import {
  afterEach,
  describe,
  test,
  vi
} from 'vitest';

import polyfill, {
  TextDecoder,
  TextEncoder
} from '../src';

interface ITextCoderGlobal {
  TextDecoder?: unknown;
  TextEncoder?: unknown;
}

describe('polyfill', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  
  test('should install the shims onto globalThis when missing', () => {
    vi.stubGlobal('TextDecoder', undefined);
    vi.stubGlobal('TextEncoder', undefined);
    
    polyfill();
    
    const global = globalThis as ITextCoderGlobal;
    
    assert.strictEqual(global.TextDecoder, TextDecoder);
    assert.strictEqual(global.TextEncoder, TextEncoder);
  });
  
  test('should not overwrite existing implementations', () => {
    const ExistingTextDecoder = {
      name: 'ExistingTextDecoder'
    };
    
    vi.stubGlobal('TextDecoder', ExistingTextDecoder);
    vi.stubGlobal('TextEncoder', undefined);
    
    polyfill();
    
    const global = globalThis as ITextCoderGlobal;
    
    assert.strictEqual(global.TextDecoder, ExistingTextDecoder);
    assert.strictEqual(global.TextEncoder, TextEncoder);
  });
  
  test('should be idempotent', () => {
    vi.stubGlobal('TextDecoder', undefined);
    vi.stubGlobal('TextEncoder', undefined);
    
    polyfill();
    polyfill();
    
    const global = globalThis as ITextCoderGlobal;
    
    assert.strictEqual(global.TextDecoder, TextDecoder);
    assert.strictEqual(global.TextEncoder, TextEncoder);
  });
});
