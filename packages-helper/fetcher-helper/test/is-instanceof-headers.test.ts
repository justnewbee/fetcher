/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofHeaders
} from '../src';

describe('isInstanceofHeaders', () => {
  test('returns true for a real Headers instance', () => {
    expect(isInstanceofHeaders(new Headers())).toBe(true);
  });
  
  test('returns false for a plain object', () => {
    expect(isInstanceofHeaders({
      'Content-Type': 'application/json'
    })).toBe(false);
  });
  
  test('returns false for null', () => {
    expect(isInstanceofHeaders(null)).toBe(false);
  });
  
  test('returns false for undefined', () => {
    expect(isInstanceofHeaders(undefined)).toBe(false);
  });
  
  test('returns false for primitives and arrays', () => {
    expect(isInstanceofHeaders('string')).toBe(false);
    expect(isInstanceofHeaders(123)).toBe(false);
    expect(isInstanceofHeaders([])).toBe(false);
  });
});
