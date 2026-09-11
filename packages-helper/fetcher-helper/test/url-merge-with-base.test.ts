import {
  describe,
  test,
  expect
} from 'vitest';

import {
  urlMergeWithBase
} from '../src';

describe('urlMergeWithBase', () => {
  test('returns url when urlBase is omitted', () => {
    expect(urlMergeWithBase('/api/users')).toBe('/api/users');
  });

  test('returns url when urlBase is an empty string', () => {
    expect(urlMergeWithBase('/api/users', '')).toBe('/api/users');
  });

  test('returns url unchanged when url is an absolute https url', () => {
    expect(urlMergeWithBase('https://example.com/api', 'https://base.com')).toBe('https://example.com/api');
  });

  test('returns url unchanged when url is an absolute http url', () => {
    expect(urlMergeWithBase('http://example.com/api', 'https://base.com')).toBe('http://example.com/api');
  });

  test('returns url unchanged when url has a port', () => {
    expect(urlMergeWithBase('https://example.com:8080/api', 'https://base.com')).toBe('https://example.com:8080/api');
  });

  test('strips the leading slash from url when both urlBase ends with / and url starts with /', () => {
    expect(urlMergeWithBase('/users', 'https://api.com/')).toBe('https://api.com/users');
    expect(urlMergeWithBase('/users', 'https://api.com/v1/')).toBe('https://api.com/v1/users');
  });

  test('inserts a slash between urlBase and url when neither has one', () => {
    expect(urlMergeWithBase('users', 'https://api.com')).toBe('https://api.com/users');
    expect(urlMergeWithBase('users/123', 'https://api.com/v1')).toBe('https://api.com/v1/users/123');
  });

  test('concatenates directly when urlBase has trailing slash but url does not', () => {
    expect(urlMergeWithBase('users', 'https://api.com/')).toBe('https://api.com/users');
    expect(urlMergeWithBase('users/123', 'https://api.com/v1/')).toBe('https://api.com/v1/users/123');
  });

  test('concatenates directly when url has leading slash but urlBase does not', () => {
    expect(urlMergeWithBase('/users', 'https://api.com')).toBe('https://api.com/users');
    expect(urlMergeWithBase('/users/123', 'https://api.com/v1')).toBe('https://api.com/v1/users/123');
  });

  test('produces a trailing slash when url is empty and urlBase has no trailing slash', () => {
    expect(urlMergeWithBase('', 'https://api.com')).toBe('https://api.com/');
  });

  test('merges a protocol-relative url because it is not considered absolute', () => {
    expect(urlMergeWithBase('//example.com/path', 'https://base.com')).toBe('//example.com/path');
  });
});
