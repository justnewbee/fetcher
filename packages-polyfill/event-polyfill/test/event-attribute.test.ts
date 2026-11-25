/* eslint-disable @typescript-eslint/no-empty-function -- empty callbacks are used as event listeners. */

import assert from 'assert';

import {
  beforeEach,
  describe,
  test
} from 'vitest';

import {
  Event as EventShim,
  EventTarget as EventTargetShim,
  getEventAttributeValue,
  setEventAttributeValue
} from '../src';
import {
  InvalidAttributeHandler
} from '../src/util';

import spy from './lib/spy';
import countEventListeners from './lib/count-event-listeners';
import setupErrorCheck from './lib/setup-error-check';

describe('Event attribute handlers', () => {
  const {
    assertWarning
  } = setupErrorCheck();
  
  let target: EventTargetShim;

  beforeEach(() => {
    target = new EventTargetShim();
  });
  
  describe('\'getEventAttributeValue\' function', () => {
    test('should throw a TypeError if non-EventTarget object is present', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        getEventAttributeValue();
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        getEventAttributeValue(null);
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        getEventAttributeValue({});
      }, TypeError);
    });
    
    test('should return null if any handlers are not set.', () => {
      assert.strictEqual(getEventAttributeValue(target, 'foo'), null);
    });
    
    test('should return null if any handlers are not set, even if listeners are added by \'addEventListener\'.', () => {
      target.addEventListener('foo', () => {
      });
      assert.strictEqual(getEventAttributeValue(target, 'foo'), null);
    });
    
    test('should return null if listeners are set to a different event by \'setEventAttributeValue\'.', () => {
      const f = (): void => {
      };

      setEventAttributeValue(target, 'bar', f);
      assert.strictEqual(getEventAttributeValue(target, 'foo'), null);
    });
    
    test('should return the set function if listeners are set by \'setEventAttributeValue\'.', () => {
      const f = (): void => {
      };

      setEventAttributeValue(target, 'foo', f);
      assert.strictEqual(getEventAttributeValue(target, 'foo'), f);
    });
    
    test('should return the set object if listeners are set by \'setEventAttributeValue\'.', () => {
      const f = {};

      // @ts-expect-error -- the runtime accepts values the public types reject
      setEventAttributeValue(target, 'foo', f);
      assert.strictEqual(getEventAttributeValue(target, 'foo'), f);
      assertWarning(InvalidAttributeHandler, f);
    });
    
    test('should return the last set function if listeners are set by \'setEventAttributeValue\' multiple times.', () => {
      const f = (): void => {
      };

      setEventAttributeValue(target, 'foo', () => {
      });
      setEventAttributeValue(target, 'foo', null);
      setEventAttributeValue(target, 'foo', () => {
      });
      setEventAttributeValue(target, 'foo', f);
      assert.strictEqual(getEventAttributeValue(target, 'foo'), f);
    });
    
    test('should handle the string representation of the type argument', () => {
      const f = (): void => {
      };

      setEventAttributeValue(target, '1000', f);
      // @ts-expect-error -- the runtime accepts values the public types reject
      assert.strictEqual(getEventAttributeValue(target, 1e3), f);
    });
  });
  
  describe('\'setEventAttributeValue\' function', () => {
    test('should throw a TypeError if non-EventTarget object is present', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        setEventAttributeValue();
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        setEventAttributeValue(null);
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        setEventAttributeValue({});
      }, TypeError);
    });
    
    test('should add an event listener if a function is given.', () => {
      setEventAttributeValue(target, 'foo', () => {
      });
      assert.strictEqual(countEventListeners(target), 1);
      assert.strictEqual(countEventListeners(target, 'foo'), 1);
    });
    
    test('should add an event listener if an object is given.', () => {
      const f = {};

      // @ts-expect-error -- the runtime accepts values the public types reject
      setEventAttributeValue(target, 'foo', f);
      assert.strictEqual(countEventListeners(target), 1);
      assert.strictEqual(countEventListeners(target, 'foo'), 1);
      assertWarning(InvalidAttributeHandler, f);
    });
    
    test('should remove an event listener if null is given.', () => {
      setEventAttributeValue(target, 'foo', () => {
      });
      assert.strictEqual(countEventListeners(target, 'foo'), 1);
      setEventAttributeValue(target, 'foo', null);
      assert.strictEqual(countEventListeners(target, 'foo'), 0);
    });
    
    test('should remove an event listener if primitive is given.', () => {
      setEventAttributeValue(target, 'foo', () => {
      });
      assert.strictEqual(countEventListeners(target, 'foo'), 1);
      // @ts-expect-error -- the runtime accepts values the public types reject
      setEventAttributeValue(target, 'foo', 3);
      assert.strictEqual(countEventListeners(target, 'foo'), 0);
      
      assertWarning(InvalidAttributeHandler, 3);
    });
    
    test('should do nothing if primitive is given and the target doesn\'t have listeners.', () => {
      setEventAttributeValue(target, 'foo', null);
      assert.strictEqual(countEventListeners(target, 'foo'), 0);
    });
    
    test('should handle the string representation of the type argument', () => {
      const f = (): void => {
      };

      // @ts-expect-error -- the runtime accepts values the public types reject
      setEventAttributeValue(target, 1e3, f);
      
      assert.strictEqual(countEventListeners(target), 1);
      assert.strictEqual(countEventListeners(target, '1000'), 1);
    });
    
    test('should keep the added order: attr, normal, capture', () => {
      const list: string[] = [];

      const f1 = (): void => {
        list.push('f1');
      };

      const f2 = (): void => {
        list.push('f2');
      };

      const f3 = (): void => {
        list.push('f3');
      };
      
      setEventAttributeValue(target, 'foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3, {
        capture: true
      });
      target.dispatchEvent(new EventShim('foo'));
      
      assert.deepStrictEqual(list, ['f1', 'f2', 'f3']);
    });
    
    test('should keep the added order: normal, capture, attr', () => {
      const list: string[] = [];

      const f1 = (): void => {
        list.push('f1');
      };

      const f2 = (): void => {
        list.push('f2');
      };

      const f3 = (): void => {
        list.push('f3');
      };
      
      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2, {
        capture: true
      });
      setEventAttributeValue(target, 'foo', f3);
      target.dispatchEvent(new EventShim('foo'));
      
      assert.deepStrictEqual(list, ['f1', 'f2', 'f3']);
    });
    
    test('should keep the added order: capture, attr, normal', () => {
      const list: string[] = [];

      const f1 = (): void => {
        list.push('f1');
      };

      const f2 = (): void => {
        list.push('f2');
      };

      const f3 = (): void => {
        list.push('f3');
      };
      
      target.addEventListener('foo', f1, {
        capture: true
      });
      setEventAttributeValue(target, 'foo', f2);
      target.addEventListener('foo', f3);
      target.dispatchEvent(new EventShim('foo'));
      
      assert.deepStrictEqual(list, ['f1', 'f2', 'f3']);
    });
    
    test('should not be called by \'dispatchEvent\' if the listener is object listener', () => {
      const f = {
        handleEvent: spy()
      };

      // @ts-expect-error -- the runtime accepts values the public types reject
      setEventAttributeValue(target, 'foo', f);
      target.dispatchEvent(new EventShim('foo'));
      
      assert.strictEqual(f.handleEvent.calls.length, 0, 'handleEvent should not be called');
      assertWarning(InvalidAttributeHandler, f);
    });
  });
});
