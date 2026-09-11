/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  mergeTypeSearchParams
} from '../src';

describe('mergeTypeSearchParams', () => {
  test('returns the first URLSearchParams instance (mutates in place)', () => {
    const sp1 = new URLSearchParams();
    const sp2 = new URLSearchParams();

    expect(mergeTypeSearchParams(sp1, sp2)).toBe(sp1);
  });

  test('adds new entries from the second URLSearchParams into the first', () => {
    const sp1 = new URLSearchParams('A=1');
    const sp2 = new URLSearchParams('B=2');

    mergeTypeSearchParams(sp1, sp2);

    expect(sp1.get('A')).toBe('1');
    expect(sp1.get('B')).toBe('2');
  });

  test('appends rather than overwrites duplicate keys', () => {
    const sp1 = new URLSearchParams('X=a');
    const sp2 = new URLSearchParams('X=b');

    mergeTypeSearchParams(sp1, sp2);

    expect(sp1.getAll('X')).toEqual(['a', 'b']);
  });

  test('does not mutate the second URLSearchParams', () => {
    const sp1 = new URLSearchParams('A=1');
    const sp2 = new URLSearchParams('B=2');

    mergeTypeSearchParams(sp1, sp2);

    expect(sp2.has('A')).toBe(false);
  });
});
