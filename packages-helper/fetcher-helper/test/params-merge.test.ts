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
  paramsMerge
} from '../src';

describe('paramsMerge', () => {
  test('merges two plain objects with params1 taking precedence', () => {
    expect(paramsMerge({
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

  test('returns a new object rather than mutating the inputs', () => {
    const params1 = {
      a: '1'
    };
    const params2 = {
      b: '2'
    };
    const merged = paramsMerge(params1, params2);

    expect(merged).not.toBe(params1);
    expect(merged).not.toBe(params2);
    expect(params1).toEqual({
      a: '1'
    });
    expect(params2).toEqual({
      b: '2'
    });
  });

  test('returns a URLSearchParams when params1 is a URLSearchParams', () => {
    const merged = paramsMerge(new URLSearchParams('a=1'), {
      b: '2'
    }) as URLSearchParams;

    expect(isInstanceofUrlSearchParams(merged)).toBe(true);
    expect(merged.toString()).toBe('a=1&b=2');
  });

  test('returns a URLSearchParams when params2 is a URLSearchParams', () => {
    const merged = paramsMerge({
      a: '1'
    }, new URLSearchParams('b=2')) as URLSearchParams;

    expect(isInstanceofUrlSearchParams(merged)).toBe(true);
    expect(merged.toString()).toBe('a=1&b=2');
  });

  test('appends entries when both are URLSearchParams rather than overwriting', () => {
    const merged = paramsMerge(new URLSearchParams('a=1'), new URLSearchParams('a=2&b=3')) as URLSearchParams;

    expect(merged.getAll('a')).toEqual(['1', '2']);
    expect(merged.get('b')).toBe('3');
  });

  test('does not mutate the original inputs when merging URLSearchParams', () => {
    const params1 = new URLSearchParams('a=1');
    const params2 = new URLSearchParams('b=2');

    paramsMerge(params1, params2);

    expect(params1.toString()).toBe('a=1');
    expect(params2.toString()).toBe('b=2');
  });
});
