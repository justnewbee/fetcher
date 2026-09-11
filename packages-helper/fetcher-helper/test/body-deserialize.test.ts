import {
  describe,
  test,
  expect
} from 'vitest';

import {
  bodyDeserialize
} from '../src';

describe('bodyDeserialize', () => {
  test('deserializes a flat body into a plain object', () => {
    expect(bodyDeserialize('a=1&b=2')).toEqual({
      a: '1',
      b: '2'
    });
  });

  test('collects repeated keys into an array', () => {
    expect(bodyDeserialize('a=1&a=2')).toEqual({
      a: ['1', '2']
    });
  });

  test('deserializes a nested body into a nested object', () => {
    expect(bodyDeserialize('a[b]=c')).toEqual({
      a: {
        b: 'c'
      }
    });
  });

  test('keeps values as strings', () => {
    expect(bodyDeserialize('a=1')).toEqual({
      a: '1'
    });
  });

  test('returns an empty object for an empty string', () => {
    expect(bodyDeserialize('')).toEqual({});
  });

  test('honors custom deserialize options', () => {
    expect(bodyDeserialize('a.b=c', {
      allowDots: true
    })).toEqual({
      a: {
        b: 'c'
      }
    });
  });
});
