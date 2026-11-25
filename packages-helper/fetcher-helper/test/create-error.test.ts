import {
  describe,
  test,
  expect
} from 'vitest';

import {
  createError
} from '../src';

describe('createError', () => {
  test('returns an Error with the given message', () => {
    const error = createError('boom');
    
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('boom');
  });
  
  test('keeps the default name "Error" when no name is given', () => {
    const error = createError('boom');
    
    expect(error.name).toBe('Error');
  });
  
  test('sets the given name', () => {
    const error = createError('boom', 'FetchError');
    
    expect(error.name).toBe('FetchError');
    expect(error.message).toBe('boom');
  });
  
  test('returns an Error with an empty message when called without arguments', () => {
    const error = createError();
    
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('');
    expect(error.name).toBe('Error');
  });
  
  test('ignores an empty-string name', () => {
    const error = createError('boom', '');
    
    expect(error.name).toBe('Error');
  });
  
  test('creates a new instance on every call', () => {
    const error1 = createError('boom');
    const error2 = createError('boom');
    
    expect(error1).not.toBe(error2);
  });
});
