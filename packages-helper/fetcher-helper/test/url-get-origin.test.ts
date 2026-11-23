/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect
} from 'vitest';

import {
  urlGetOrigin
} from '../src';

describe('urlGetOrigin with location', () => {
  test('extracts the origin from an https url with path and query', () => {
    expect(urlGetOrigin('https://example.com/path/to?q=1')).toBe('https://example.com');
  });

  test('returns the whole http url when it has no path', () => {
    expect(urlGetOrigin('http://example.com')).toBe('http://example.com');
  });

  test('includes the port in the origin', () => {
    expect(urlGetOrigin('https://example.com:8080/api')).toBe('https://example.com:8080');
  });

  test('strips userinfo from the origin', () => {
    expect(urlGetOrigin('https://user:pass@example.com/api')).toBe('https://example.com');
  });

  test('resolves a protocol-relative url against location.href', () => {
    expect(urlGetOrigin('//example.com/path')).toBe(`${location.protocol}//example.com`);
  });

  test('normalizes the case of the origin', () => {
    expect(urlGetOrigin('HTTPS://EXAMPLE.COM')).toBe('https://example.com');
  });

  test('returns an empty string for a relative path', () => {
    expect(urlGetOrigin('/relative/path')).toBe('');
    expect(urlGetOrigin('relative/path')).toBe('');
  });

  test('returns an empty string for undefined', () => {
    expect(urlGetOrigin()).toBe('');
  });

  test('returns an empty string for an empty string', () => {
    expect(urlGetOrigin('')).toBe('');
  });

  test('returns an empty string when there is no host after the scheme', () => {
    expect(urlGetOrigin('https://')).toBe('');
  });

  test('returns an empty string when invalid url', () => {
    expect(urlGetOrigin('https//example.com')).toBe('');
  });
});
