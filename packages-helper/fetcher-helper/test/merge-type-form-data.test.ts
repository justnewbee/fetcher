/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  mergeTypeFormData
} from '../src';

describe('mergeTypeFormData', () => {
  test('returns the first FormData instance (mutates in place)', () => {
    const fd1 = new FormData();
    const fd2 = new FormData();

    expect(mergeTypeFormData(fd1, fd2)).toBe(fd1);
  });

  test('adds new entries from the second FormData into the first', () => {
    const fd1 = new FormData();
    const fd2 = new FormData();

    fd1.append('A', '1');
    fd2.append('B', '2');

    mergeTypeFormData(fd1, fd2);

    expect(fd1.get('A')).toBe('1');
    expect(fd1.get('B')).toBe('2');
  });

  test('appends rather than overwrites duplicate keys', () => {
    const fd1 = new FormData();
    const fd2 = new FormData();

    fd1.append('X', 'a');
    fd2.append('X', 'b');

    mergeTypeFormData(fd1, fd2);

    expect(fd1.getAll('X')).toEqual(['a', 'b']);
  });

  test('does not mutate the second FormData', () => {
    const fd1 = new FormData();
    const fd2 = new FormData();

    fd1.append('A', '1');
    fd2.append('B', '2');

    mergeTypeFormData(fd1, fd2);

    expect(fd2.has('A')).toBe(false);
  });
});
