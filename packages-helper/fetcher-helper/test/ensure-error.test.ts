import {
  describe,
  test,
  expect
} from 'vitest';

import {
  ensureError
} from '../src';

describe('ensureError', () => {
  test('returns the same Error instance when given an Error', () => {
    const originalError = new Error('boom');

    const result = ensureError(originalError);

    expect(result).toBe(originalError);
    expect(result.message).toBe('boom');
  });

  test('fills in name with "Error" when the Error name is empty', () => {
    const originalError = new Error('boom');
    
    originalError.name = '';

    const result = ensureError(originalError);

    expect(result).toBe(originalError);
    expect(result.name).toBe('Error');
  });

  test('clones an Error whose name is a getter-only property', () => {
    const cause = new Error('root');
    const originalError = new Error('boom');
    
    originalError.cause = cause;
    
    Object.defineProperty(originalError, 'name', {
      get() {
        return 'CustomError';
      },
      enumerable: true,
      configurable: true
    });

    const result = ensureError(originalError);

    expect(result).not.toBe(originalError);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('boom');
    expect(result.name).toBe('CustomError');
    expect(result.stack).toBe(originalError.stack);
    expect(result.cause).toBe(cause);
  });

  test('clones a DOMException into a plain Error with a re-assignable name', () => {
    const originalError = new DOMException('aborted', 'AbortError');

    const result = ensureError(originalError);

    expect(result).not.toBe(originalError);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('aborted');
    expect(result.name).toBe('AbortError');

    result.name = 'RenamedError';
    expect(result.name).toBe('RenamedError');
  });

  test('returns an empty Error for falsy values', () => {
    for (const falsyValue of [undefined, null, false, 0, '', Number.NaN]) {
      const result = ensureError(falsyValue);

      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('');
      expect(result.name).toBe('Error');
    }
  });
  
  test('wraps a string into an Error with the string as message', () => {
    const result = ensureError('boom');
    
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('boom');
  });

  test('wraps a number using its string representation', () => {
    const result = ensureError(123);
    
    expect(result.message).toBe('123');
  });

  test('wraps an object using its string representation', () => {
    const result = ensureError({
      foo: 'bar'
    });
    
    expect(result.message).toBe('[object Object]');
  });

  test('wraps an array using its string representation', () => {
    const result = ensureError([1, 2, 3]);
    
    expect(result.message).toBe('1,2,3');
  });

  test('wraps a Symbol using its string representation', () => {
    const result = ensureError(Symbol('boom'));
    
    expect(result.message).toBe('Symbol(boom)');
  });
});
