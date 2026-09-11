/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  bodySerialize
} from '../src';

describe('bodySerialize', () => {
  test('returns an empty string when body is null', () => {
    expect(bodySerialize(null)).toBe('');
  });

  test('returns an empty string when body is undefined', () => {
    expect(bodySerialize(undefined)).toBe('');
  });

  test('returns a string body as-is', () => {
    expect(bodySerialize('raw-string')).toBe('raw-string');
  });

  test('returns a FormData body as the same reference', () => {
    const body = new FormData();

    body.append('a', '1');

    expect(bodySerialize(body)).toBe(body);
  });

  test('returns a URLSearchParams body as the same reference', () => {
    const body = new URLSearchParams('a=1');

    expect(bodySerialize(body)).toBe(body);
  });

  test('returns a Blob body as the same reference', () => {
    const body = new Blob(['blob-content']);

    expect(bodySerialize(body)).toBe(body);
  });

  test('serializes a plain object', () => {
    expect(bodySerialize({
      a: '1',
      b: 'two'
    })).toBe('a=1&b=two');
  });

  test('serializes arrays with repeated keys by default', () => {
    expect(bodySerialize({
      a: [1, 2]
    })).toBe('a=1&a=2');
  });

  test('serializes nested objects with encoded brackets by default', () => {
    expect(bodySerialize({
      a: {
        b: 1
      }
    })).toBe('a%5Bb%5D=1');
  });

  test('honors custom serialize options', () => {
    expect(bodySerialize({
      a: {
        b: 1
      }
    }, {
      allowDots: true
    })).toBe('a.b=1');
  });
});
