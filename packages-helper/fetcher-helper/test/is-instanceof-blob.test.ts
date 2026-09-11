/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofBlob
} from '../src';

describe('isInstanceofBlob', () => {
  test('returns true for a real Blob instance', () => {
    expect(isInstanceofBlob(new Blob(['hello']))).toBe(true);
  });

  test('returns false for a plain object', () => {
    expect(isInstanceofBlob({
      size: 5
    })).toBe(false);
  });

  test('returns false for null', () => {
    expect(isInstanceofBlob(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isInstanceofBlob(undefined)).toBe(false);
  });

  test('returns false for primitives, arrays and other web types', () => {
    expect(isInstanceofBlob('string')).toBe(false);
    expect(isInstanceofBlob(123)).toBe(false);
    expect(isInstanceofBlob([])).toBe(false);
    expect(isInstanceofBlob(new ArrayBuffer(8))).toBe(false);
    expect(isInstanceofBlob(new FormData())).toBe(false);
  });
});
