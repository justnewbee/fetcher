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
    assert.throws(() => new AbortSignal(), TypeError);
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
  
  test('should do nothing from \'throwIfAborted()\' if not aborted', () => {
    const controller = new AbortController();
    
    assert.doesNotThrow(() => controller.signal.throwIfAborted());
  });
  
  test('should throw the abort reason from \'throwIfAborted()\' if aborted', () => {
    const controller = new AbortController();
    const reason = new Error('stop');
    
    controller.abort(reason);
    
    assert.throws(() => controller.signal.throwIfAborted(), (error: unknown) => error === reason);
  });
  
  test('should create an already aborted signal without dispatching an event from \'AbortSignal.abort()\'', () => {
    const reason = new Error('stop');
    const signal = AbortSignal.abort(reason);
    let called = 0;
    
    signal.addEventListener('abort', () => {
      called += 1;
    });
    
    assert.strictEqual(signal.aborted, true);
    assert.strictEqual(signal.reason, reason);
    assert.strictEqual(called, 0);
  });
  
  test('should use an AbortError by default from \'AbortSignal.abort()\'', () => {
    const signal = AbortSignal.abort();
    
    assert(signal.reason instanceof DOMException);
    assert.strictEqual(signal.reason.name, 'AbortError');
  });
  
  test('should abort when any source signal is aborted from \'AbortSignal.any()\'', () => {
    const first = new AbortController();
    const second = new AbortController();
    const signal = AbortSignal.any([first.signal, second.signal]);
    const reason = new Error('stop');
    
    assert.strictEqual(signal.aborted, false);
    
    second.abort(reason);
    
    assert.strictEqual(signal.aborted, true);
    assert.strictEqual(signal.reason, reason);
  });
  
  test('should return an already aborted signal from \'AbortSignal.any()\' if a source signal has been aborted', () => {
    const signal = AbortSignal.any([AbortSignal.abort('done')]);
    
    assert.strictEqual(signal.aborted, true);
    assert.strictEqual(signal.reason, 'done');
  });
  
  test('should return a signal which is never aborted from \'AbortSignal.any()\' without source signals', () => {
    const signal = AbortSignal.any([]);
    
    assert.strictEqual(signal.aborted, false);
  });
  
  test('should abort with a TimeoutError after the given milliseconds from \'AbortSignal.timeout()\'', async () => {
    const signal = AbortSignal.timeout(10);
    
    assert.strictEqual(signal.aborted, false);
    
    await new Promise<void>(resolve => {
      signal.addEventListener('abort', () => {
        resolve();
      });
    });
    
    assert.strictEqual(signal.aborted, true);
    assert(signal.reason instanceof DOMException);
    assert.strictEqual(signal.reason.name, 'TimeoutError');
  });
  
  test('should throw a TypeError if \'AbortSignal.timeout()\' receives an invalid milliseconds', () => {
    assert.throws(() => AbortSignal.timeout(-1), TypeError);
    assert.throws(() => AbortSignal.timeout(Number.NaN), TypeError);
    assert.throws(() => AbortSignal.timeout(Number.POSITIVE_INFINITY), TypeError);
  });
});
