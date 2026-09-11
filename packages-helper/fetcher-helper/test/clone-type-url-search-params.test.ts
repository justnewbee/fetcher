/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofUrlSearchParams,
  cloneTypeUrlSearchParams
} from '../src';

describe('cloneTypeUrlSearchParams', () => {
  test('returns a URLSearchParams instance', () => {
    expect(isInstanceofUrlSearchParams(cloneTypeUrlSearchParams({}))).toBe(true);
  });

  test('clones entries from a URLSearchParams instance', () => {
    const cloned = cloneTypeUrlSearchParams(new URLSearchParams('a=1&b=2'));

    expect(cloned.get('a')).toBe('1');
    expect(cloned.get('b')).toBe('2');
  });

  test('clones entries from a plain object', () => {
    const cloned = cloneTypeUrlSearchParams({
      a: '1',
      b: '2'
    });

    expect(cloned.get('a')).toBe('1');
    expect(cloned.get('b')).toBe('2');
  });

  test('converts numeric values from a plain object to string', () => {
    const cloned = cloneTypeUrlSearchParams({
      a: 1024
    });

    expect(cloned.get('a')).toBe('1024');
  });

  test('returns a new instance rather than the same URLSearchParams reference', () => {
    const source = new URLSearchParams('a=1');
    const cloned = cloneTypeUrlSearchParams(source);

    expect(cloned).not.toBe(source);
  });

  test('does not mutate the source URLSearchParams', () => {
    const source = new URLSearchParams('a=1');

    cloneTypeUrlSearchParams(source);

    expect(source.get('a')).toBe('1');
    expect(source.has('b')).toBe(false);
  });

  test('preserves duplicate keys from a URLSearchParams source', () => {
    const cloned = cloneTypeUrlSearchParams(new URLSearchParams('a=1&a=2'));

    expect(cloned.getAll('a')).toEqual(['1', '2']);
  });

  test('handles an empty URLSearchParams and plain object', () => {
    expect(cloneTypeUrlSearchParams(new URLSearchParams()).toString()).toBe('');
    expect(cloneTypeUrlSearchParams({}).toString()).toBe('');
  });
});
