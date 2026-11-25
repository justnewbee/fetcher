/* eslint-disable @typescript-eslint/no-deprecated */
import assert from 'node:assert';

import {
  describe,
  test
} from 'vitest';

import polyfill, {
  Event,
  EventTarget
} from '../src';
import {
  FalsyWasAssignedToCancelBubble,
  InitEventWasCalledWhileDispatching,
  NonCancelableEventWasCanceled,
  TruthyWasAssignedToReturnValue
} from '../src/util';

import setupErrorCheck from './lib/setup-error-check';

const NativeEvent = (globalThis as {
  Event?: typeof Event;
}).Event;

describe('\'Event\' class', () => {
  const {
    assertWarning
  } = setupErrorCheck();
  
  describe('constructor', () => {
    test('should return an Event object', () => {
      assert(new Event('') instanceof Event);
    });
    
    test('should throw a TypeError if called as a function', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        Event('');
      });
    });
    
    (NativeEvent ? describe : describe.skip)('if native Event class is present', () => {
      test('should not replace the native Event class', () => {
        polyfill();
        
        assert.strictEqual((globalThis as { Event?: typeof Event; }).Event, NativeEvent);
      });
    });
  });
  
  describe('\'type\' property', () => {
    test('should be the value of the constructor\'s first argument', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.type, 'foo');
    });
    
    test('should be the string representation of the constructor\'s first argument', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      assert.strictEqual(new Event().type, 'undefined');
      // @ts-expect-error -- the runtime accepts values the public types reject
      assert.strictEqual(new Event(null).type, 'null');
      // @ts-expect-error -- the runtime accepts values the public types reject
      assert.strictEqual(new Event(1e3).type, '1000');
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.type = 'bar';
      });
    });
  });
  
  describe('\'target\' property', () => {
    test('should be null', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.target, null);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.target = null;
      });
    });
    
    test('should be the event target under dispatching', () => {
      const target = new EventTarget();
      const event = new Event('foo');
      let ok = false;
      
      target.addEventListener('foo', () => {
        assert.strictEqual(event.target, target);
        ok = true;
      });
      target.dispatchEvent(event);
      
      assert.strictEqual(event.target, null);
      assert(ok);
    });
  });
  
  describe('\'srcElement\' property', () => {
    test('should be null', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.srcElement, null);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.srcElement = null;
      });
    });
    
    test('should be the event target under dispatching', () => {
      const target = new EventTarget();
      const event = new Event('foo');
      let ok = false;
      
      target.addEventListener('foo', () => {
        assert.strictEqual(event.srcElement, target);
        ok = true;
      });
      target.dispatchEvent(event);
      
      assert.strictEqual(event.srcElement, null);
      assert(ok);
    });
  });
  
  describe('\'currentTarget\' property', () => {
    test('should be null', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.currentTarget, null);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.currentTarget = null;
      });
    });
    
    test('should be the event target under dispatching', () => {
      const target = new EventTarget();
      const event = new Event('foo');
      let ok = false;
      
      target.addEventListener('foo', () => {
        assert.strictEqual(event.currentTarget, target);
        ok = true;
      });
      target.dispatchEvent(event);
      
      assert.strictEqual(event.currentTarget, null);
      assert(ok);
    });
  });
  
  describe('\'composedPath\' method', () => {
    test('should return an empty array', () => {
      const event = new Event('foo');
      
      assert.deepStrictEqual(event.composedPath(), []);
    });
    
    test('should return the event target under dispatching', () => {
      const target = new EventTarget();
      const event = new Event('foo');
      let ok = false;
      
      target.addEventListener('foo', () => {
        assert.deepStrictEqual(event.composedPath(), [target]);
        ok = true;
      });
      target.dispatchEvent(event);
      
      assert.deepStrictEqual(event.composedPath(), []);
      assert(ok);
    });
  });
  
  describe('\'NONE\' property', () => {
    test('should be 0', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.NONE, 0);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.NONE = -1;
      });
    });
  });
  
  describe('\'NONE\' static property', () => {
    test('should be 0', () => {
      assert.strictEqual(Event.NONE, 0);
    });
    
    test('should be readonly', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        Event.NONE = -1;
      });
    });
  });
  
  describe('\'CAPTURING_PHASE\' property', () => {
    test('should be 1', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.CAPTURING_PHASE, 1);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.CAPTURING_PHASE = -1;
      });
    });
  });
  
  describe('\'CAPTURING_PHASE\' static property', () => {
    test('should be 1', () => {
      assert.strictEqual(Event.CAPTURING_PHASE, 1);
    });
    
    test('should be readonly', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        Event.CAPTURING_PHASE = -1;
      });
    });
  });
  
  describe('\'AT_TARGET\' property', () => {
    test('should be 2', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.AT_TARGET, 2);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.AT_TARGET = -1;
      });
    });
  });
  
  describe('\'AT_TARGET\' static property', () => {
    test('should be 2', () => {
      assert.strictEqual(Event.AT_TARGET, 2);
    });
    
    test('should be readonly', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        Event.AT_TARGET = -1;
      });
    });
  });
  
  describe('\'BUBBLING_PHASE\' property', () => {
    test('should be 3', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.BUBBLING_PHASE, 3);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.BUBBLING_PHASE = -1;
      });
    });
  });
  
  describe('\'BUBBLING_PHASE\' static property', () => {
    test('should be 3', () => {
      assert.strictEqual(Event.BUBBLING_PHASE, 3);
    });
    
    test('should be readonly', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        Event.BUBBLING_PHASE = -1;
      });
    });
  });
  
  describe('\'eventPhase\' property', () => {
    test('should be 0', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.eventPhase, 0);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.eventPhase = -1;
      });
    });
    
    test('should be 2 under dispatching', () => {
      const target = new EventTarget();
      const event = new Event('foo');
      let ok = false;
      
      target.addEventListener('foo', () => {
        assert.strictEqual(event.eventPhase, 2);
        ok = true;
      });
      target.dispatchEvent(event);
      
      assert.strictEqual(event.eventPhase, 0);
      assert(ok);
    });
  });
  
  describe('\'stopPropagation\' method', () => {
    test('should return undefined', () => {
      const event = new Event('foo');
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- this test asserts the void return value
      const result = event.stopPropagation();
      
      assert.strictEqual(result, undefined);
    });
  });
  
  describe('\'cancelBubble\' property', () => {
    test('should be false', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.cancelBubble, false);
    });
    
    test('should be true after \'stopPropagation\' method was called', () => {
      const event = new Event('foo');
      
      event.stopPropagation();
      assert.strictEqual(event.cancelBubble, true);
    });
    
    test('should be true after \'stopImmediatePropagation\' method was called', () => {
      const event = new Event('foo');
      
      event.stopImmediatePropagation();
      assert.strictEqual(event.cancelBubble, true);
    });
    
    test('should be writable', () => {
      const event = new Event('foo');
      
      event.cancelBubble = true;
      assert.strictEqual(event.cancelBubble, true);
    });
    
    test('should NOT be changed by the assignment of false after \'stopPropagation\' method was called', () => {
      const event = new Event('foo');
      
      event.stopPropagation();
      event.cancelBubble = false;
      assert.strictEqual(event.cancelBubble, true);
      assertWarning(FalsyWasAssignedToCancelBubble);
    });
    
    test('should NOT be changed by the assignment of false after \'stopImmediatePropagation\' method was called', () => {
      const event = new Event('foo');
      
      event.stopImmediatePropagation();
      event.cancelBubble = false;
      assert.strictEqual(event.cancelBubble, true);
      assertWarning(FalsyWasAssignedToCancelBubble);
    });
    
    test('should NOT be changed by the assignment of false after the assignment of true', () => {
      const event = new Event('foo');
      
      event.cancelBubble = true;
      event.cancelBubble = false;
      assert.strictEqual(event.cancelBubble, true);
      assertWarning(FalsyWasAssignedToCancelBubble);
    });
  });
  
  describe('\'stopImmediatePropagation\' method', () => {
    test('should return undefined', () => {
      const event = new Event('foo');
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- this test asserts the void return value
      const result = event.stopImmediatePropagation();
      
      assert.strictEqual(result, undefined);
    });
  });
  
  describe('\'bubbles\' property', () => {
    test('should be false if the constructor option was not present', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.bubbles, false);
    });
    
    test('should be false if the constructor option was false', () => {
      const event = new Event('foo', {
        bubbles: false
      });
      
      assert.strictEqual(event.bubbles, false);
    });
    
    test('should be true if the constructor option was true', () => {
      const event = new Event('foo', {
        bubbles: true
      });
      
      assert.strictEqual(event.bubbles, true);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.bubbles = true;
      });
    });
  });
  
  describe('\'cancelable\' property', () => {
    test('should be false if the constructor option was not present', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.cancelable, false);
    });
    
    test('should be false if the constructor option was false', () => {
      const event = new Event('foo', {
        cancelable: false
      });
      
      assert.strictEqual(event.cancelable, false);
    });
    
    test('should be true if the constructor option was true', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      assert.strictEqual(event.cancelable, true);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.cancelable = true;
      });
    });
  });
  
  describe('\'returnValue\' property', () => {
    test('should be true', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.returnValue, true);
    });
    
    test('should be true after \'preventDefault\' method was called if \'cancelable\' is false', () => {
      const event = new Event('foo');
      
      event.preventDefault();
      assert.strictEqual(event.returnValue, true);
      assertWarning(NonCancelableEventWasCanceled);
    });
    
    test('should be false after \'preventDefault\' method was called if \'cancelable\' is true', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      event.preventDefault();
      assert.strictEqual(event.returnValue, false);
    });
    
    test('should NOT be changed by assignment if \'cancelable\' is false', () => {
      const event = new Event('foo');
      
      event.returnValue = false;
      assert.strictEqual(event.returnValue, true);
      assertWarning(NonCancelableEventWasCanceled);
    });
    
    test('should be changed by assignment if \'cancelable\' is true', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      event.returnValue = false;
      assert.strictEqual(event.returnValue, false);
    });
    
    test('should NOT be changed by the assignment of true after \'preventDefault\' method was called', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      event.preventDefault();
      event.returnValue = true;
      assert.strictEqual(event.returnValue, false);
      assertWarning(TruthyWasAssignedToReturnValue);
    });
    
    test('should NOT be changed by the assignment of true after the assginment of false', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      event.returnValue = false;
      event.returnValue = true;
      assert.strictEqual(event.returnValue, false);
      assertWarning(TruthyWasAssignedToReturnValue);
    });
  });
  
  describe('\'preventDefault\' method', () => {
    test('should return undefined', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- this test asserts the void return value
      const result = event.preventDefault();
      
      assert.strictEqual(result, undefined);
    });
    
    test('should return undefined', () => {
      const event = new Event('foo');
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- this test asserts the void return value
      const result = event.preventDefault();
      
      assert.strictEqual(result, undefined);
      assertWarning(NonCancelableEventWasCanceled);
    });
  });
  
  describe('\'defaultPrevented\' property', () => {
    test('should be false', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.defaultPrevented, false);
    });
    
    test('should be false after \'preventDefault\' method was called if \'cancelable\' is false', () => {
      const event = new Event('foo');
      
      event.preventDefault();
      assert.strictEqual(event.defaultPrevented, false);
      assertWarning(NonCancelableEventWasCanceled);
    });
    
    test('should be false after \'preventDefault\' method was called if \'cancelable\' is true', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      event.preventDefault();
      assert.strictEqual(event.defaultPrevented, true);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.defaultPrevented = true;
      });
    });
  });
  
  describe('\'composed\' property', () => {
    test('should be false if the constructor option was not present', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.composed, false);
    });
    
    test('should be false if the constructor option was false', () => {
      const event = new Event('foo', {
        composed: false
      });
      
      assert.strictEqual(event.composed, false);
    });
    
    test('should be true if the constructor option was true', () => {
      const event = new Event('foo', {
        composed: true
      });
      
      assert.strictEqual(event.composed, true);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.composed = true;
      });
    });
  });
  
  describe('\'isTrusted\' property', () => {
    test('should be false', () => {
      const event = new Event('foo');
      
      assert.strictEqual(event.isTrusted, false);
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.isTrusted = true;
      });
    });
    
    test('should NOT be configurable', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        Object.defineProperty(event, 'isTrusted', {
          value: true
        });
      });
    });
    
    test('should NOT be overridable', () => {
      class CustomEvent extends Event {
        // eslint-disable-next-line @typescript-eslint/class-literal-property-style -- a getter is required to override without defining an own property
        public get isTrusted(): boolean {
          return true;
        }
      }
      
      const event = new CustomEvent('foo');
      
      assert.strictEqual(event.isTrusted, false);
    });
  });
  
  describe('\'timeStamp\' property', () => {
    test('should be a number', () => {
      const event = new Event('foo');
      
      assert.strictEqual(typeof event.timeStamp, 'number');
    });
    
    test('should be readonly', () => {
      const event = new Event('foo');
      
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        event.timeStamp = 0;
      });
    });
  });
  
  describe('\'initEvent\' method', () => {
    test('should return undefined', () => {
      const event = new Event('foo');
      const result = event.initEvent('bar'); // eslint-disable-line @typescript-eslint/no-confusing-void-expression
      
      assert.strictEqual(result, undefined);
    });
    
    test('should set type', () => {
      const event = new Event('foo');
      
      event.initEvent('bar');
      assert.strictEqual(event.type, 'bar');
    });
    
    test('should set type (string representation)', () => {
      const event = new Event('foo');
      
      // @ts-expect-error -- the runtime accepts values the public types reject
      event.initEvent(1e3);
      assert.strictEqual(event.type, '1000');
    });
    
    test('should set bubbles', () => {
      const event = new Event('foo');
      
      event.initEvent('foo', true);
      assert.strictEqual(event.bubbles, true);
      assert.strictEqual(event.cancelable, false);
      assert.strictEqual(event.composed, false);
    });
    
    test('should set cancelable', () => {
      const event = new Event('foo', {
        bubbles: true
      });
      
      event.initEvent('foo', undefined, true);
      assert.strictEqual(event.bubbles, false);
      assert.strictEqual(event.cancelable, true);
      assert.strictEqual(event.composed, false);
    });
    
    test('should not change composed', () => {
      const event = new Event('foo', {
        bubbles: true,
        cancelable: true,
        composed: true
      });
      
      event.initEvent('foo');
      assert.strictEqual(event.bubbles, false);
      assert.strictEqual(event.cancelable, false);
      assert.strictEqual(event.composed, true);
    });
    
    test('should reset \'stopPropagation\' flag', () => {
      const event = new Event('foo');
      
      event.stopPropagation();
      assert.strictEqual(event.cancelBubble, true);
      event.initEvent('foo');
      assert.strictEqual(event.cancelBubble, false);
    });
    
    test('should reset \'canceled\' flag', () => {
      const event = new Event('foo', {
        cancelable: true
      });
      
      event.preventDefault();
      assert.strictEqual(event.defaultPrevented, true);
      event.initEvent('foo');
      assert.strictEqual(event.defaultPrevented, false);
    });
    
    test('should do nothing under dispatching', () => {
      const target = new EventTarget();
      const event = new Event('foo');
      
      target.addEventListener('foo', () => {
        event.initEvent('bar');
      });
      target.dispatchEvent(event);
      
      assert.strictEqual(event.type, 'foo');
      assertWarning(InitEventWasCalledWhileDispatching);
    });
  });
  
  describe('for-in', () => {
    test('should enumerate 22 property names', () => {
      const event = new Event('foo');
      const actualKeys = new Set<string>();
      
      for (const key in event) {
        actualKeys.add(key);
      }
      
      for (const expectedKey of [
        'type',
        'target',
        'srcElement',
        'currentTarget',
        'composedPath',
        'NONE',
        'CAPTURING_PHASE',
        'AT_TARGET',
        'BUBBLING_PHASE',
        'eventPhase',
        'stopPropagation',
        'cancelBubble',
        'stopImmediatePropagation',
        'bubbles',
        'cancelable',
        'returnValue',
        'preventDefault',
        'defaultPrevented',
        'composed',
        'isTrusted',
        'timeStamp',
        'initEvent'
      ]) {
        assert(actualKeys.has(expectedKey), `for-in loop should iterate '${expectedKey}' key`);
      }
    });
    
    test('should enumerate 4 property names in static', () => {
      const actualKeys = [];
      const expectedKeys = [
        'AT_TARGET',
        'BUBBLING_PHASE',
        'CAPTURING_PHASE',
        'NONE'
      ];
      
      for (const key in Event) {
        actualKeys.push(key);
      }
      
      assert.deepStrictEqual(actualKeys.sort(undefined), expectedKeys.sort(undefined));
    });
  });
});
