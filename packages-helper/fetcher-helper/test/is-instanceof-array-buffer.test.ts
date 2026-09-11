/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofArrayBuffer
} from '../src';

describe('isInstanceofArrayBuffer', () => {
  test('returns true for an ArrayBuffer instance', () => {
    expect(isInstanceofArrayBuffer(new ArrayBuffer(8))).toBe(true);
  });

  test('returns false for a TypedArray view over an ArrayBuffer', () => {
    expect(isInstanceofArrayBuffer(new Uint8Array(8))).toBe(false);
  });

  test('returns false for null', () => {
    expect(isInstanceofArrayBuffer(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isInstanceofArrayBuffer(undefined)).toBe(false);
  });

  test('returns false for primitives, arrays and other web types', () => {
    expect(isInstanceofArrayBuffer('string')).toBe(false);
    expect(isInstanceofArrayBuffer(123)).toBe(false);
    expect(isInstanceofArrayBuffer([])).toBe(false);
    expect(isInstanceofArrayBuffer(new Blob(['x']))).toBe(false);
  });
});
