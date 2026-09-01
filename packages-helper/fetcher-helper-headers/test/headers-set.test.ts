/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  headersSet
} from '../src';

describe('headersSet', () => {
  test('sets a value on a Headers instance', () => {
    const headers = new Headers();
    
    headersSet(headers, 'Content-Type', 'application/json');
    
    expect(headers.get('Content-Type')).toBe('application/json');
  });
  
  test('overwrites an existing value on a Headers instance', () => {
    const headers = new Headers({
      'Content-Type': 'text/plain'
    });
    
    headersSet(headers, 'Content-Type', 'application/json');
    
    expect(headers.get('Content-Type')).toBe('application/json');
  });
  
  test('sets a value on a plain object', () => {
    const headers: Record<string, string> = {};
    
    headersSet(headers, 'Content-Type', 'application/json');
    
    expect(headers['Content-Type']).toBe('application/json');
  });
  
  test('overwrites an existing value on a plain object', () => {
    const headers: Record<string, string> = {
      'Content-Type': 'text/plain'
    };
    
    headersSet(headers, 'Content-Type', 'application/json');
    
    expect(headers['Content-Type']).toBe('application/json');
  });
});
