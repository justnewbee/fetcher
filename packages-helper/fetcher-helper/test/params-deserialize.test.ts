import {
  describe,
  test,
  expect
} from 'vitest';

import {
  paramsDeserialize
} from '../src';

describe('paramsDeserialize', () => {
  test('deserializes flat params into a plain object', () => {
    expect(paramsDeserialize('a=1&b=2')).toEqual({
      a: '1',
      b: '2'
    });
  });

  test('collects repeated keys into an array', () => {
    expect(paramsDeserialize('a=1&a=2')).toEqual({
      a: ['1', '2']
    });
  });

  test('deserializes nested params into a nested object', () => {
    expect(paramsDeserialize('a[b]=c')).toEqual({
      a: {
        b: 'c'
      }
    });
  });

  test('keeps values as strings', () => {
    expect(paramsDeserialize('a=1')).toEqual({
      a: '1'
    });
  });

  test('returns an empty object for an empty string', () => {
    expect(paramsDeserialize('')).toEqual({});
  });

  test('honors custom deserialize options', () => {
    expect(paramsDeserialize('a[b]=c', {
      allowDots: true
    })).toEqual({
      a: {
        b: 'c'
      }
    });

    expect(paramsDeserialize('a.b=c', {
      allowDots: true
    })).toEqual({
      a: {
        b: 'c'
      }
    });
  });
});
