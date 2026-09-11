/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  paramsSerialize
} from '../src';

describe('paramsSerialize', () => {
  test('returns an empty string when params is null', () => {
    expect(paramsSerialize(null)).toBe('');
  });

  test('returns an empty string when params is undefined', () => {
    expect(paramsSerialize(undefined)).toBe('');
  });

  test('returns a string params as-is', () => {
    expect(paramsSerialize('a=1&b=2')).toBe('a=1&b=2');
  });

  test('serializes a URLSearchParams via toString', () => {
    expect(paramsSerialize(new URLSearchParams('a=1&b=2'))).toBe('a=1&b=2');
  });

  test('serializes a plain object', () => {
    expect(paramsSerialize({
      a: '1',
      b: 'two'
    })).toBe('a=1&b=two');
  });

  test('serializes arrays without indices by default', () => {
    expect(paramsSerialize({
      a: [1, 2]
    })).toBe('a=1&a=2');
  });

  test('serializes nested objects with encoded brackets by default', () => {
    expect(paramsSerialize({
      a: {
        b: 'c'
      }
    })).toBe('a%5Bb%5D=c');
  });

  test('serializes an empty object to an empty string', () => {
    expect(paramsSerialize({})).toBe('');
  });

  test('honors custom serialize options', () => {
    expect(paramsSerialize({
      a: {
        b: 'c'
      }
    }, {
      allowDots: true
    })).toBe('a.b=c');

    expect(paramsSerialize({
      a: [1, 2]
    }, {
      indices: true
    })).toBe('a%5B0%5D=1&a%5B1%5D=2');
  });
});
