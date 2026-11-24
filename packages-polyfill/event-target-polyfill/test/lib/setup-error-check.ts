import assert from 'node:assert';

import {
  afterEach,
  beforeEach
} from 'vitest';

import {
  setErrorHandler,
  setWarningHandler
} from '../../src';
import {
  IWarning
} from '../../src/types';
import {
  Warning
} from '../../src/util';

export interface IErrorChecker {
  assertError(errorOrMessage: Error | string): void;
  assertWarning<Args extends unknown[]>(warning: Warning<Args>, ...args: Args): void;
}

export function setupErrorCheck(): IErrorChecker {
  const errors: Error[] = [];
  const warnings: IWarning[] = [];
  
  beforeEach(() => {
    errors.length = 0;
    warnings.length = 0;
    setErrorHandler(error => {
      errors.push(error);
    });
    setWarningHandler(warning => {
      warnings.push(warning);
    });
  });
  
  afterEach(() => {
    setErrorHandler(undefined);
    setWarningHandler(undefined);
    assert.deepStrictEqual(errors, [], 'Errors should be nothing.');
    assert.deepStrictEqual(warnings, [], 'Warnings should be nothing.');
  });
  
  function assertError(errorOrMessage: Error | string): void {
    const actualError = errors.shift();
    
    assert.strictEqual(typeof errorOrMessage === 'string' ? actualError?.message : actualError, errorOrMessage);
  }
  
  function assertWarning<Args extends unknown[]>(warning: Warning<Args>, ...args: Args): void {
    const actualWarning = warnings.shift();
    
    assert.deepStrictEqual(actualWarning, {
      code: warning.code,
      message: warning.message,
      args
    });
  }
  
  return {
    assertError,
    assertWarning
  };
}
