/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  headersNormalizeToPlain
} from '../src';

describe('headersNormalizeToPlain', () => {
  test('returns an empty object when input is undefined', () => {
    expect(headersNormalizeToPlain(undefined)).toEqual({});
  });
  
  test('returns an empty object for an empty Headers', () => {
    expect(headersNormalizeToPlain(new Headers())).toEqual({});
  });
  
  test('returns an empty object for an empty plain object', () => {
    expect(headersNormalizeToPlain({})).toEqual({});
  });
  
  test('converts a Headers into a normalized plain object', () => {
    const headers = new Headers({
      'content-type': 'application/json',
      'x-request-id': 'abc'
    });
    
    expect(headersNormalizeToPlain(headers)).toEqual({
      'Content-Type': 'application/json',
      'X-Request-Id': 'abc'
    });
  });
  
  test('normalizes mixed-case Headers keys', () => {
    const headers = new Headers({
      'CoNtEnT-TyPe': 'text/plain'
    });
    
    expect(headersNormalizeToPlain(headers)).toEqual({
      'Content-Type': 'text/plain'
    });
  });
  
  test('joins repeated Headers values with a comma', () => {
    const headers = new Headers();
    
    headers.append('x-tag', 'a');
    headers.append('x-tag', 'b');
    
    expect(headersNormalizeToPlain(headers)).toEqual({
      'X-Tag': 'a, b'
    });
  });
  
  test('normalizes a plain object with mixed-case keys', () => {
    expect(headersNormalizeToPlain({
      'content-type': 'text/plain',
      accept: '*/*'
    })).toEqual({
      'Content-Type': 'text/plain',
      Accept: '*/*'
    });
  });
  
  test('converts non-string plain values to strings', () => {
    expect(headersNormalizeToPlain({
      'content-length': 1024,
      'x-cache': true
    })).toEqual({
      'Content-Length': '1024',
      'X-Cache': 'true'
    });
  });
  
  test('does not mutate the original Headers', () => {
    const headers = new Headers({
      'content-type': 'text/plain'
    });
    
    headersNormalizeToPlain(headers);
    
    expect(headers.get('content-type')).toBe('text/plain');
  });
  
  test('does not mutate the original plain object', () => {
    const headers = {
      'content-type': 'text/plain'
    };
    
    headersNormalizeToPlain(headers);
    
    expect(headers).toEqual({
      'content-type': 'text/plain'
    });
  });
});
