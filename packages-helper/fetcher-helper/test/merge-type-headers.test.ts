/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  mergeTypeHeaders
} from '../src';

describe('mergeTypeHeaders', () => {
  test('returns the first Headers instance (mutates in place)', () => {
    const h1 = new Headers();
    const h2 = new Headers();
    
    expect(mergeTypeHeaders(h1, h2)).toBe(h1);
  });
  
  test('adds new entries from the second Headers into the first', () => {
    const h1 = new Headers({
      A: '1'
    });
    const h2 = new Headers({
      B: '2'
    });
    
    mergeTypeHeaders(h1, h2);
    
    expect(h1.get('A')).toBe('1');
    expect(h1.get('B')).toBe('2');
  });
  
  test('overwrites existing keys using set rather than append', () => {
    const h1 = new Headers();
    
    h1.set('X', 'a');
    h1.append('X', 'b');
    
    const h2 = new Headers({
      X: 'c'
    });
    
    mergeTypeHeaders(h1, h2);
    
    expect(h1.get('X')).toBe('c');
  });
  
  test('does not mutate the second Headers', () => {
    const h1 = new Headers({
      A: '1'
    });
    const h2 = new Headers({
      B: '2'
    });
    
    mergeTypeHeaders(h1, h2);
    
    expect(h2.has('A')).toBe(false);
  });
});
