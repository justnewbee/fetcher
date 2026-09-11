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
  isInstanceofUrlSearchParams,
  bodyMerge
} from '../src';

describe('bodyMerge', () => {
  test('merges two plain objects with body1 taking precedence', () => {
    expect(bodyMerge({
      a: '1',
      b: '2'
    }, {
      b: '3',
      c: '4'
    })).toEqual({
      a: '1',
      b: '2',
      c: '4'
    });
  });

  test('returns a FormData when body1 is a FormData', () => {
    const body1 = new FormData();
    const body2 = {
      b: '2'
    };

    body1.append('a', '1');

    const merged = bodyMerge(body1, body2) as FormData;

    expect(isInstanceofFormData(merged)).toBe(true);
    expect(merged.get('a')).toBe('1');
    expect(merged.get('b')).toBe('2');
  });

  test('returns a FormData when body2 is a FormData', () => {
    const body2 = new FormData();

    body2.append('b', '2');

    const merged = bodyMerge({
      a: '1'
    }, body2) as FormData;

    expect(isInstanceofFormData(merged)).toBe(true);
    expect(merged.get('a')).toBe('1');
    expect(merged.get('b')).toBe('2');
  });

  test('appends entries when both are FormData rather than overwriting', () => {
    const body1 = new FormData();
    const body2 = new FormData();

    body1.append('a', '1');
    body2.append('a', '2');

    const merged = bodyMerge(body1, body2) as FormData;

    expect(merged.getAll('a')).toEqual(['1', '2']);
  });

  test('returns a URLSearchParams when body1 is a URLSearchParams', () => {
    const merged = bodyMerge(new URLSearchParams('a=1'), {
      b: '2'
    }) as URLSearchParams;

    expect(isInstanceofUrlSearchParams(merged)).toBe(true);
    expect(merged.toString()).toBe('a=1&b=2');
  });

  test('returns a URLSearchParams when body2 is a URLSearchParams', () => {
    const merged = bodyMerge({
      a: '1'
    }, new URLSearchParams('b=2')) as URLSearchParams;

    expect(isInstanceofUrlSearchParams(merged)).toBe(true);
    expect(merged.toString()).toBe('a=1&b=2');
  });

  test('prefers FormData over URLSearchParams', () => {
    const merged = bodyMerge(new URLSearchParams('a=1'), new FormData());

    expect(isInstanceofFormData(merged)).toBe(true);
    expect(isInstanceofUrlSearchParams(merged)).toBe(false);
  });

  test('does not mutate the original inputs', () => {
    const body1 = new FormData();
    const body2 = new FormData();

    body1.append('a', '1');
    body2.append('b', '2');

    bodyMerge(body1, body2);

    expect(body1.has('b')).toBe(false);
    expect(body2.has('a')).toBe(false);
  });
});
