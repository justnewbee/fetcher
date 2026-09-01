/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  headersDelete
} from '../src';

describe('headersDelete', () => {
  test('deletes a key from a Headers instance', () => {
    const headers = new Headers({
      'Content-Type': 'text/plain'
    });
    
    headersDelete(headers, 'Content-Type');
    
    expect(headers.has('Content-Type')).toBe(false);
  });
  
  test('is a no-op when key does not exist on Headers', () => {
    const headers = new Headers();
    
    headersDelete(headers, 'Missing');
    
    expect(headers.has('Missing')).toBe(false);
  });
  
  test('deletes a key from a plain object', () => {
    const headers: Record<string, string> = {
      'Content-Type': 'text/plain'
    };
    
    headersDelete(headers, 'Content-Type');
    
    expect('Content-Type' in headers).toBe(false);
  });
  
  test('is a no-op when key does not exist on a plain object', () => {
    const headers: Record<string, string> = {};
    
    headersDelete(headers, 'Missing');
    
    expect('Missing' in headers).toBe(false);
  });
});
