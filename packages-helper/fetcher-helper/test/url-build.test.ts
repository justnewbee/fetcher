/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  urlBuild
} from '../src';

describe('urlBuild', () => {
  test('returns the url unchanged when params is omitted', () => {
    expect(urlBuild('/api')).toBe('/api');
  });

  test('returns the url unchanged when params is null', () => {
    expect(urlBuild('/api', null)).toBe('/api');
  });

  test('returns the url unchanged when it already has a query and params is omitted', () => {
    expect(urlBuild('/api?x=1')).toBe('/api?x=1');
  });

  test('returns the url unchanged when params is an empty object', () => {
    expect(urlBuild('/api', {})).toBe('/api');
  });

  test('appends object params to a url without a query string', () => {
    expect(urlBuild('/api', {
      a: '1'
    })).toBe('/api?a=1');
  });

  test('appends string params as-is', () => {
    expect(urlBuild('/api', 'a=1&b=2')).toBe('/api?a=1&b=2');
  });

  test('appends URLSearchParams params via toString', () => {
    expect(urlBuild('/api', new URLSearchParams('a=1'))).toBe('/api?a=1');
  });

  test('serializes array params with repeated keys by default', () => {
    expect(urlBuild('/api', {
      a: [1, 2]
    })).toBe('/api?a=1&a=2');
  });

  test('merges object params into an existing query, passed params first', () => {
    expect(urlBuild('/api?x=1', {
      a: '2'
    })).toBe('/api?a=2&x=1');
  });

  test('keeps the existing query value when passed params has the same key', () => {
    expect(urlBuild('/api?x=1', {
      x: '2'
    })).toBe('/api?x=1');
  });

  test('merges string params into an existing query', () => {
    expect(urlBuild('/api?x=1', 'y=2')).toBe('/api?y=2&x=1');
  });

  test('keeps the existing query value when passed string params has the same key', () => {
    expect(urlBuild('/api?x=1', 'x=2')).toBe('/api?x=1');
  });

  test('keeps the existing query when params is an empty object', () => {
    expect(urlBuild('/api?x=1', {})).toBe('/api?x=1');
  });

  test('returns the url unchanged when the merged query serializes to an empty string', () => {
    expect(urlBuild('/api?', {})).toBe('/api?');
  });

  test('handles a url ending with a bare question mark', () => {
    expect(urlBuild('/api?', {
      a: '1'
    })).toBe('/api?a=1');
  });

  test('merges URLSearchParams params into an existing query, existing entries first', () => {
    expect(urlBuild('/api?x=1', new URLSearchParams('a=2'))).toBe('/api?x=1&a=2');
  });

  test('honors custom serialize options for the existing query and passed params', () => {
    expect(urlBuild('/api?a=1', {
      b: {
        c: 'd'
      }
    }, {
      allowDots: true
    })).toBe('/api?b.c=d&a=1');

    expect(urlBuild('/api', {
      a: {
        b: 'c'
      }
    }, {
      allowDots: true
    })).toBe('/api?a.b=c');
  });
});
