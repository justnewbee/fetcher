import assert from 'assert';

import {
  describe,
  test
} from 'vitest';

import {
  AbortController,
  AbortSignal
} from '../src';

describe('\'AbortSignal\' class', () => {
  test('should throw a TypeError if constructed directly', () => {
    assert.throws(() => {
      return new AbortSignal();
    }, TypeError);
  });
  
  test('should have an enumerable \'aborted\' property', () => {
    assert.strictEqual(Object.prototype.propertyIsEnumerable.call(AbortSignal.prototype, 'aborted'), true);
  });
  
  test('should return "[object AbortSignal]" from toString()', () => {
    const controller = new AbortController();
    
    assert.strictEqual(Object.prototype.toString.call(controller.signal), '[object AbortSignal]');
  });
  
  test('should throw a TypeError if \'aborted\' is read from a non-AbortSignal object', () => {
    const descriptor = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted');
    const getter = descriptor?.get;
    
    assert(getter);
    assert.throws(() => getter.call({}), TypeError);
  });
  
  test('should dispatch an \'abort\' event only once', () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const events: Event[] = [];
    
    signal.addEventListener('abort', function (this: AbortSignal, event: Event) {
      assert.strictEqual(this, signal);
      events.push(event);
    });
    
    assert.strictEqual(signal.aborted, false);
    
    controller.abort();
    controller.abort();
    
    assert.strictEqual(signal.aborted, true);
    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0]?.type, 'abort');
  });
  
  test('should support the \'onabort\' event attribute', () => {
    const controller = new AbortController();
    const signal = controller.signal;
    let called = 0;
    
    const handler = function (this: AbortSignal, event: Event): void {
      assert.strictEqual(this, signal);
      assert.strictEqual(event.type, 'abort');
      called += 1;
    };
    
    assert.strictEqual(signal.onabort, null);
    
    signal.onabort = handler;
    assert.strictEqual(signal.onabort, handler);
    
    controller.abort();
    assert.strictEqual(called, 1);
  });
  
  test('should remove the \'onabort\' handler when assigned null', () => {
    const controller = new AbortController();
    const signal = controller.signal;
    let called = 0;
    
    signal.onabort = () => {
      called += 1;
    };

    signal.onabort = null;
    
    controller.abort();
    
    assert.strictEqual(called, 0);
    assert.strictEqual(signal.onabort, null);
  });
});
