/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  headersGet
} from '../src';

describe('headersGet', () => {
  test('returns the value from a Headers instance', () => {
    const headers = new Headers({
      'Content-Type': 'text/plain'
    });
    
    expect(headersGet(headers, 'Content-Type')).toBe('text/plain');
  });
  
  test('returns null for a missing key in a Headers instance', () => {
    const headers = new Headers();
    
    expect(headersGet(headers, 'Missing')).toBeNull();
  });
  
  test('returns the value from a plain object', () => {
    expect(headersGet({
      'Content-Type': 'text/plain'
    }, 'Content-Type')).toBe('text/plain');
  });
  
  test('returns undefined for a missing key in a plain object', () => {
    expect(headersGet({}, 'Missing')).toBeUndefined();
  });
});
