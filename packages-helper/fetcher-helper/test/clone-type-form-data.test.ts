/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  isInstanceofFormData,
  cloneTypeFormData
} from '../src';

describe('cloneTypeFormData', () => {
  test('returns a FormData instance', () => {
    expect(isInstanceofFormData(cloneTypeFormData({}))).toBe(true);
  });

  test('clones entries from a FormData instance', () => {
    const source = new FormData();

    source.append('a', '1');
    source.append('b', '2');

    const cloned = cloneTypeFormData(source);

    expect(cloned.get('a')).toBe('1');
    expect(cloned.get('b')).toBe('2');
  });

  test('clones entries from a URLSearchParams', () => {
    const cloned = cloneTypeFormData(new URLSearchParams('a=1&b=2'));

    expect(cloned.get('a')).toBe('1');
    expect(cloned.get('b')).toBe('2');
  });

  test('clones entries from a plain object', () => {
    const cloned = cloneTypeFormData({
      a: '1',
      b: '2'
    });

    expect(cloned.get('a')).toBe('1');
    expect(cloned.get('b')).toBe('2');
  });

  test('converts numeric values from a plain object to string', () => {
    const cloned = cloneTypeFormData({
      a: 1024
    });

    expect(cloned.get('a')).toBe('1024');
  });

  test('returns a new instance rather than the same FormData reference', () => {
    const source = new FormData();

    source.append('a', '1');

    const cloned = cloneTypeFormData(source);

    expect(cloned).not.toBe(source);
  });

  test('does not mutate the source FormData', () => {
    const source = new FormData();

    source.append('a', '1');

    cloneTypeFormData(source);

    expect(source.has('b')).toBe(false);
    expect(source.get('a')).toBe('1');
  });

  test('preserves duplicate keys from a FormData source', () => {
    const source = new FormData();

    source.append('a', '1');
    source.append('a', '2');

    const cloned = cloneTypeFormData(source);

    expect(cloned.getAll('a')).toEqual(['1', '2']);
  });

  test('handles an empty FormData, URLSearchParams and plain object', () => {
    for (const cloned of [cloneTypeFormData(new FormData()), cloneTypeFormData(new URLSearchParams()), cloneTypeFormData({})]) {
      expect([...cloned.keys()]).toEqual([]);
    }
  });
});
