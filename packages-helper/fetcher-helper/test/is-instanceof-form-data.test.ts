/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofFormData
} from '../src';

describe('isInstanceofFormData', () => {
  test('returns true for a real FormData instance', () => {
    expect(isInstanceofFormData(new FormData())).toBe(true);
  });

  test('returns false for a plain object', () => {
    expect(isInstanceofFormData({
      a: '1'
    })).toBe(false);
  });

  test('returns false for null', () => {
    expect(isInstanceofFormData(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isInstanceofFormData(undefined)).toBe(false);
  });

  test('returns false for primitives, arrays and other web types', () => {
    expect(isInstanceofFormData('string')).toBe(false);
    expect(isInstanceofFormData(123)).toBe(false);
    expect(isInstanceofFormData([])).toBe(false);
    expect(isInstanceofFormData(new Headers())).toBe(false);
    expect(isInstanceofFormData(new URLSearchParams())).toBe(false);
  });
});
