/**
 * @vitest-environment jsdom
 */
import {
  vi,
  describe,
  expect,
  test
} from 'vitest';

import {
  decodeText
} from '../src';
import decodeTextFallback from '../src/helper/fundamental/decode-text-fallback'; // 保证一样

describe('decodeText', () => {
  test('decodes UTF-8 Uint8Array', () => {
    const input = new TextEncoder().encode('hello 世界');
    
    expect(decodeText(input)).toBe('hello 世界');
    expect(decodeTextFallback(input)).toBe('hello 世界');
  });
  
  test('decodes ArrayBuffer input', () => {
    const input = new TextEncoder().encode('test').buffer;
    
    expect(decodeText(input)).toBe('test');
    expect(decodeTextFallback(input)).toBe('test');
  });
  
  test('decodes ASCII string', () => {
    const input = new TextEncoder().encode('hello world');
    
    expect(decodeText(input)).toBe('hello world');
    expect(decodeTextFallback(input)).toBe('hello world');
  });
  
  test('decodes emoji', () => {
    const input = new TextEncoder().encode('🎉🚀');
    
    expect(decodeText(input)).toBe('🎉🚀');
    expect(decodeTextFallback(input)).toBe('🎉🚀');
  });
  
  test('decodes empty input', () => {
    const input = new Uint8Array(0);
    
    expect(decodeText(input)).toBe('');
    expect(decodeTextFallback(input)).toBe('');
  });
  
  test('uses fallback when TextDecoder is unavailable', async () => {
    const originalTextDecoder = globalThis.TextDecoder;
    
    // @ts-expect-error simulate environment without TextDecoder
    delete globalThis.TextDecoder;
    
    vi.resetModules();
    
    const {
      default: decodeTextReloaded
    } = await import('../src/helper/fundamental/decode-text');
    
    const input = new TextEncoder().encode('fallback');
    
    expect(decodeTextReloaded(input)).toBe('fallback');
    expect(decodeTextFallback(input)).toBe('fallback');
    
    globalThis.TextDecoder = originalTextDecoder;
  });
  
  test('fallback handles Chinese characters', async () => {
    const originalTextDecoder = globalThis.TextDecoder;
    
    // @ts-expect-error simulate environment without TextDecoder
    delete globalThis.TextDecoder;
    
    vi.resetModules();
    
    const {
      default: decodeTextReloaded
    } = await import('../src/helper/fundamental/decode-text');
    
    const input = new TextEncoder().encode('你好世界');
    
    expect(decodeTextReloaded(input)).toBe('你好世界');
    expect(decodeTextFallback(input)).toBe('你好世界');
    
    globalThis.TextDecoder = originalTextDecoder;
  });
});
