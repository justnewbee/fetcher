/**
 * @vitest-environment jsdom
 */
import {
  describe,
  expect,
  test
} from 'vitest';

import {
  decodeText
} from '../src';

describe('decodeText', () => {
  test('decodes UTF-8 Uint8Array', () => {
    const input = new TextEncoder().encode('hello 世界');
    
    expect(decodeText(input)).toBe('hello 世界');
  });
  
  test('decodes ArrayBuffer input', () => {
    const input = new TextEncoder().encode('test').buffer;
    
    expect(decodeText(input)).toBe('test');
  });
  
  test('decodes ASCII string', () => {
    const input = new TextEncoder().encode('hello world');
    
    expect(decodeText(input)).toBe('hello world');
  });
  
  test('decodes emoji', () => {
    const input = new TextEncoder().encode('🎉🚀');
    
    expect(decodeText(input)).toBe('🎉🚀');
  });
  
  test('decodes empty input', () => {
    const input = new Uint8Array(0);
    
    expect(decodeText(input)).toBe('');
  });
});
