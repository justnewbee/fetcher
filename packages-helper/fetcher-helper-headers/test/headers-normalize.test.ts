import {
  describe,
  test,
  expect
} from 'vitest';

import {
  headersNormalize
} from '../src';

describe('headersNormalize', () => {
  test('returns an empty object when input is undefined', () => {
    expect(headersNormalize(undefined)).toEqual({});
  });
  
  test('capitalizes hyphenated keys', () => {
    expect(headersNormalize({
      'content-type': 'text/plain'
    })).toEqual({
      'Content-Type': 'text/plain'
    });
  });
  
  test('keeps already-capitalized keys unchanged', () => {
    expect(headersNormalize({
      'Content-Type': 'text/plain'
    })).toEqual({
      'Content-Type': 'text/plain'
    });
  });
  
  test('capitalizes single-word keys', () => {
    expect(headersNormalize({
      accept: 'application/json'
    })).toEqual({
      Accept: 'application/json'
    });
  });
  
  test('capitalizes each segment of multi-segment keys', () => {
    expect(headersNormalize({
      'x-custom-header': 'value'
    })).toEqual({
      'X-Custom-Header': 'value'
    });
  });
  
  test('converts numeric values to string', () => {
    expect(headersNormalize({
      'content-length': 1024
    })).toEqual({
      'Content-Length': '1024'
    });
  });
  
  test('converts boolean values to string', () => {
    expect(headersNormalize({
      'x-cache': true
    })).toEqual({
      'X-Cache': 'true'
    });
  });
  
  test('handles multiple keys at once', () => {
    const result = headersNormalize({
      'content-type': 'application/json',
      accept: '*/*',
      'x-request-id': 42
    });
    
    expect(result).toEqual({
      'Content-Type': 'application/json',
      Accept: '*/*',
      'X-Request-Id': '42'
    });
  });
});
