/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  cloneTypeHeaders,
  isInstanceofHeaders
} from '../src';

describe('cloneTypeHeaders', () => {
  test('returns a Headers instance', () => {
    expect(isInstanceofHeaders(cloneTypeHeaders({}))).toBe(true);
  });
  
  test('clones entries from a Headers instance', () => {
    const source = new Headers({
      'Content-Type': 'text/plain',
      Accept: '*/*'
    });
    const cloned = cloneTypeHeaders(source);
    
    expect(cloned.get('Content-Type')).toBe('text/plain');
    expect(cloned.get('Accept')).toBe('*/*');
  });
  
  test('clones entries from a plain object', () => {
    const source = {
      'Content-Type': 'text/plain',
      Accept: '*/*'
    };
    const cloned = cloneTypeHeaders(source);
    
    expect(cloned.get('Content-Type')).toBe('text/plain');
    expect(cloned.get('Accept')).toBe('*/*');
  });
  
  test('returns a new instance rather than the same Headers reference', () => {
    const source = new Headers({
      'Content-Type': 'text/plain'
    });
    const cloned = cloneTypeHeaders(source);
    
    expect(cloned).not.toBe(source);
  });
  
  test('handles an empty Headers', () => {
    const cloned = cloneTypeHeaders(new Headers());
    let count = 0;
    
    cloned.forEach(() => {
      count++;
    });
    
    expect(count).toBe(0);
  });
  
  test('handles an empty plain object', () => {
    const cloned = cloneTypeHeaders({});
    let count = 0;
    
    cloned.forEach(() => {
      count++;
    });
    
    expect(count).toBe(0);
  });
});
