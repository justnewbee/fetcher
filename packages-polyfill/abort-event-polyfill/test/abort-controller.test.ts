import assert from 'assert';

import {
  describe,
  test
} from 'vitest';

import {
  AbortController,
  AbortSignal
} from '../src';

describe('\'AbortController\' class', () => {
  test('should initialize the \'signal\' property', () => {
    const controller = new AbortController();
    
    assert(controller.signal instanceof AbortSignal);
    assert.strictEqual(controller.signal.aborted, false);
  });
  
  test('should create an independent signal for each controller', () => {
    const first = new AbortController();
    const second = new AbortController();
    
    first.abort();
    
    assert.notStrictEqual(first.signal, second.signal);
    assert.strictEqual(first.signal.aborted, true);
    assert.strictEqual(second.signal.aborted, false);
  });
  
  test('should have enumerable \'signal\' and \'abort\' members', () => {
    assert.strictEqual(Object.prototype.propertyIsEnumerable.call(AbortController.prototype, 'signal'), true);
    assert.strictEqual(Object.prototype.propertyIsEnumerable.call(AbortController.prototype, 'abort'), true);
  });
  
  test('should return "[object AbortController]" from toString()', () => {
    assert.strictEqual(Object.prototype.toString.call(new AbortController()), '[object AbortController]');
  });
  
  test('should throw a TypeError if \'signal\' is read from a non-AbortController object', () => {
    const descriptor = Object.getOwnPropertyDescriptor(AbortController.prototype, 'signal');
    const getter = descriptor?.get;
    
    assert(getter);
    assert.throws(() => getter.call({}), TypeError);
  });
  
  test('should throw a TypeError if \'abort\' is called on a non-AbortController object', () => {
    assert.throws(() => AbortController.prototype.abort.call({}), TypeError);
  });
  
  test('should abort the signal with the given reason', () => {
    const controller = new AbortController();
    const reason = new Error('stop');
    
    controller.abort(reason);
    
    assert.strictEqual(controller.signal.aborted, true);
    assert.strictEqual(controller.signal.reason, reason);
  });
  
  test('should abort the signal with an AbortError by default', () => {
    const controller = new AbortController();
    
    controller.abort();
    
    assert(controller.signal.reason instanceof DOMException);
    assert.strictEqual(controller.signal.reason.name, 'AbortError');
  });
});
