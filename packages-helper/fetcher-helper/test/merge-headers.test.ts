/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  mergeHeaders,
  headersGet,
  isInstanceofHeaders
} from '../src';

describe('mergeHeaders', () => {
  test('when both inputs are Headers, returns a Headers containing all entries', () => {
    const h1 = new Headers({
      A: '1'
    });
    const h2 = new Headers({
      B: '2'
    });
    
    const merged = mergeHeaders(h1, h2);
    
    expect(isInstanceofHeaders(merged)).toBe(true);
    expect((merged as Headers).get('A')).toBe('1');
    expect((merged as Headers).get('B')).toBe('2');
  });
  
  test('when headers2 is Headers and headers1 is plain, returns a Headers', () => {
    const h1 = {
      A: '1'
    };
    const h2 = new Headers({
      B: '2'
    });
    
    const merged = mergeHeaders(h1, h2);
    
    expect(isInstanceofHeaders(merged)).toBe(true);
    expect(headersGet(merged, 'A')).toBe('1');
    expect(headersGet(merged, 'B')).toBe('2');
  });
  
  test('when headers1 is Headers and headers2 is plain, returns a Headers', () => {
    const h1 = {
      A: '1'
    };
    const h2 = {
      B: '2'
    };
    
    const merged = mergeHeaders(h1, h2);
    
    expect(isInstanceofHeaders(merged)).toBe(false);
    expect(headersGet(merged, 'A')).toBe('1');
    expect(headersGet(merged, 'B')).toBe('2');
  });
  
  test('when both inputs are plain objects, returns a plain object with normalized keys', () => {
    const h1 = {
      'content-type': 'text/plain'
    };
    const h2 = {
      accept: 'application/json'
    };
    
    const merged = mergeHeaders(h1, h2);
    
    expect(isInstanceofHeaders(merged)).toBe(false);
    expect((merged as Record<string, string>)['Content-Type']).toBe('text/plain');
    expect((merged as Record<string, string>).Accept).toBe('application/json');
  });
  
  test('does not mutate the original Headers inputs', () => {
    const h1 = new Headers({
      A: '1'
    });
    const h2 = new Headers({
      B: '2'
    });
    
    mergeHeaders(h1, h2);
    
    expect(h1.has('B')).toBe(false);
    expect(h2.has('A')).toBe(false);
  });
  
  test('does not mutate the original plain object inputs', () => {
    const h1 = {
      A: '1'
    };
    const h2 = {
      B: '2'
    };
    
    mergeHeaders(h1, h2);
    
    expect('B' in h1).toBe(false);
    expect('A' in h2).toBe(false);
  });
});
