/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofUrlSearchParams
} from '../src';

describe('isInstanceofUrlSearchParams', () => {
  test('returns true for a real URLSearchParams instance', () => {
    expect(isInstanceofUrlSearchParams(new URLSearchParams('a=1'))).toBe(true);
  });

  test('returns false for a plain object', () => {
    expect(isInstanceofUrlSearchParams({
      a: '1'
    })).toBe(false);
  });

  test('returns false for null', () => {
    expect(isInstanceofUrlSearchParams(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isInstanceofUrlSearchParams(undefined)).toBe(false);
  });

  test('returns false for primitives, arrays and other web types', () => {
    expect(isInstanceofUrlSearchParams('a=1')).toBe(false);
    expect(isInstanceofUrlSearchParams(123)).toBe(false);
    expect(isInstanceofUrlSearchParams([])).toBe(false);
    expect(isInstanceofUrlSearchParams(new Headers())).toBe(false);
    expect(isInstanceofUrlSearchParams(new FormData())).toBe(false);
  });
});
