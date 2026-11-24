/* eslint-disable @typescript-eslint/no-deprecated -- this suite intentionally exercises deprecated DOM APIs. */
/* eslint-disable @typescript-eslint/no-empty-function -- empty callbacks are used as event listeners. */

import assert from 'assert';

import {
  beforeEach,
  describe,
  it
} from 'vitest';

import EventTargetShim, {
  Event as EventShim
} from '../src/index';
import polyfillEventTarget from '../src/polyfill/polyfill-event-target';
import {
  CanceledInPassiveListener,
  EventListenerWasDuplicated,
  InvalidEventListener,
  NonCancelableEventWasCanceled,
  OptionWasIgnored
} from '../src/util';

import {
  TSpy,
  spy
} from './lib/spy';
import {
  AbortSignalStub
} from './lib/abort-signal-stub';
import {
  countEventListeners
} from './lib/count-event-listeners';
import {
  setupErrorCheck
} from './lib/setup-error-check';

const NativeDomException: typeof DOMException | undefined = (globalThis as { DOMException?: typeof DOMException; }).DOMException;
const NativeEventTarget: typeof EventShim | undefined = (globalThis as { EventTarget?: typeof EventShim; }).EventTarget;
const NativeEvent: typeof EventShim | undefined = (globalThis as { Event?: typeof EventShim; }).Event;
const NativeKeyboardEvent: typeof KeyboardEvent | undefined = (globalThis as { KeyboardEvent?: typeof KeyboardEvent; }).KeyboardEvent;
const NativeMouseEvent: typeof MouseEvent | undefined = (globalThis as { MouseEvent?: typeof MouseEvent; }).MouseEvent;

describe('\'EventTarget\' class', () => {
  const {
    assertError,
    assertWarning
  } = setupErrorCheck();

  describe('constructor', () => {
    it('should not throw', () => {
      assert(new EventTargetShim());
    });

    it('should throw a TypeError if called as a function.', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        EventTargetShim();
      }, TypeError);
    });

    const nativeDescribe = NativeEventTarget ? describe : describe.skip;

    nativeDescribe('if native EventTarget class is present', () => {
      it('should not replace the native EventTarget class', () => {
        polyfillEventTarget();

        assert.strictEqual((globalThis as { EventTarget?: typeof EventTargetShim; }).EventTarget, NativeEventTarget);
      });
    });
  });

  describe('\'addEventListener\' method', () => {
    let target: EventTargetShim;

    beforeEach(() => {
      target = new EventTargetShim();
    });

    it('should do nothing if callback is nothing.', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener();
      target.addEventListener('foo');
      target.addEventListener('foo', null);
      target.addEventListener('foo', undefined);

      assert.strictEqual(countEventListeners(target), 0);
      assertWarning(InvalidEventListener, undefined);
      assertWarning(InvalidEventListener, undefined);
      assertWarning(InvalidEventListener, null);
      assertWarning(InvalidEventListener, undefined);
    });

    it('should throw a TypeError if callback is a primitive.', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.addEventListener('foo', true);
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.addEventListener('foo', 1);
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.addEventListener('foo', 'function');
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.addEventListener('foo', Symbol('symbol'));
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.addEventListener('foo', 0n);
      }, TypeError);

      assert.strictEqual(countEventListeners(target), 0);
    });

    it('should add a given event listener.', () => {
      target.addEventListener('foo', () => {});
      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should add a given object.', () => {
      const f = {};

      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener('foo', f);
      assert.strictEqual(countEventListeners(target), 1);
      assertWarning(InvalidEventListener, f);
    });

    it('should add multiple given event listeners.', () => {
      target.addEventListener('foo', () => {});
      target.addEventListener('foo', () => {});
      target.addEventListener('foo', () => {});
      target.addEventListener('bar', () => {});

      assert.strictEqual(countEventListeners(target), 4);
      assert.strictEqual(countEventListeners(target, 'foo'), 3);
      assert.strictEqual(countEventListeners(target, 'bar'), 1);
    });

    it('should handle non-string types as string types.', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener(null, () => {});
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener(undefined, () => {});
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener(1e3, () => {});

      assert.strictEqual(countEventListeners(target), 3);
      assert.strictEqual(countEventListeners(target, 'null'), 1);
      assert.strictEqual(countEventListeners(target, 'undefined'), 1);
      assert.strictEqual(countEventListeners(target, '1000'), 1);
    });

    it('should not add the same listener twice.', () => {
      const f = (): void => {};

      target.addEventListener('foo', f);
      target.addEventListener('foo', f);
      target.addEventListener('bar', f);

      assert.strictEqual(countEventListeners(target), 2);
      assert.strictEqual(countEventListeners(target, 'foo'), 1);
      assert.strictEqual(countEventListeners(target, 'bar'), 1);
      assertWarning(EventListenerWasDuplicated, 'bubble', f);
    });

    it('should add the same listener twice if capture flag is different.', () => {
      const f = (): void => {};

      target.addEventListener('foo', f, {
        capture: true
      });
      target.addEventListener('foo', f, {
        capture: false
      });

      assert.strictEqual(countEventListeners(target), 2);
      assert.strictEqual(countEventListeners(target, 'foo'), 2);
    });

    it('should add the same listener twice if capture flag is different. (boolean option)', () => {
      const f = (): void => {};

      target.addEventListener('foo', f, true);
      target.addEventListener('foo', f, false);

      assert.strictEqual(countEventListeners(target), 2);
      assert.strictEqual(countEventListeners(target, 'foo'), 2);
    });

    it('should not add the same listener twice even if passive flag is different.', () => {
      const f = (): void => {};

      target.addEventListener('foo', f, {
        passive: true
      });
      target.addEventListener('foo', f, {
        passive: false
      });

      assert.strictEqual(countEventListeners(target), 1);
      assertWarning(EventListenerWasDuplicated, 'bubble', f);
      assertWarning(OptionWasIgnored, 'passive');
    });

    it('should not add the same listener twice even if once flag is different.', () => {
      const f = (): void => {};

      target.addEventListener('foo', f, {
        once: true
      });
      target.addEventListener('foo', f, {
        once: false
      });

      assert.strictEqual(countEventListeners(target), 1);
      assertWarning(EventListenerWasDuplicated, 'bubble', f);
      assertWarning(OptionWasIgnored, 'once');
    });

    it('should not add the same listener twice even if signal flag is different.', () => {
      const f = (): void => {};

      target.addEventListener('foo', f, {
        signal: null
      });
      target.addEventListener('foo', f, {
        signal: new AbortSignalStub()
      });

      assert.strictEqual(countEventListeners(target), 1);
      assertWarning(EventListenerWasDuplicated, 'bubble', f);
      assertWarning(OptionWasIgnored, 'signal');
    });

    it('should not add the same listener twice even if flags are different.', () => {
      const f = (): void => {};

      target.addEventListener('foo', f, {
        passive: true,
        once: true,
        signal: null
      });
      target.addEventListener('foo', f, {
        passive: false,
        once: false,
        signal: new AbortSignalStub()
      });

      assert.strictEqual(countEventListeners(target), 1);
      assertWarning(EventListenerWasDuplicated, 'bubble', f);
      assertWarning(OptionWasIgnored, 'passive');
      assertWarning(OptionWasIgnored, 'once');
      assertWarning(OptionWasIgnored, 'signal');
    });

    it('should not add the listener if abort signal is present and the `signal.aborted` is true.', () => {
      const signal = new AbortSignalStub();

      signal.abort();

      target.addEventListener('foo', () => {}, {
        signal
      });
      assert.strictEqual(countEventListeners(target), 0);
    });

    it('should remove the listener if abort signal was notified.', () => {
      const signal = new AbortSignalStub();

      target.addEventListener('foo', () => {}, {
        signal
      });
      assert.strictEqual(countEventListeners(target), 1);

      signal.abort();
      assert.strictEqual(countEventListeners(target), 0);
    });
  });

  describe('\'removeEventListener\' method', () => {
    const f = (): void => {};
    let target: EventTargetShim;

    beforeEach(() => {
      target = new EventTargetShim();
      target.addEventListener('foo', f);
      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should do nothing if callback is nothing.', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener();
      target.removeEventListener('foo');
      target.removeEventListener('foo', null);
      target.removeEventListener('foo', undefined);

      assert.strictEqual(countEventListeners(target, 'foo'), 1);
      assertWarning(InvalidEventListener, undefined);
      assertWarning(InvalidEventListener, undefined);
      assertWarning(InvalidEventListener, null);
      assertWarning(InvalidEventListener, undefined);
    });

    it('should throw a TypeError if callback is a primitive.', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.removeEventListener('foo', true);
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.removeEventListener('foo', 1);
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.removeEventListener('foo', 'function');
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.removeEventListener('foo', Symbol('symbol'));
      }, TypeError);
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.removeEventListener('foo', 0n);
      }, TypeError);

      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should remove a given event listener.', () => {
      target.removeEventListener('foo', f);
      assert.strictEqual(countEventListeners(target), 0);
    });

    it('should not remove any listeners if the event type is different.', () => {
      target.removeEventListener('bar', f);
      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should not remove any listeners if the callback function is different.', () => {
      target.removeEventListener('foo', () => {});
      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should not remove any listeners if the capture flag is different.', () => {
      target.removeEventListener('foo', f, true);
      target.removeEventListener('foo', f, {
        capture: true
      });
      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should handle capture flag correctly.', () => {
      target.addEventListener('foo', f, {
        capture: true
      });
      assert.strictEqual(countEventListeners(target), 2);

      target.removeEventListener('foo', f, {
        capture: true
      });
      target.removeEventListener('foo', f, {
        capture: true
      });
      assert.strictEqual(countEventListeners(target), 1);
    });

    it('should remove a given event listener even if the passive flag is present.', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener('foo', f, {
        passive: true
      });
      assert.strictEqual(countEventListeners(target), 0);
    });

    it('should remove a given event listener even if the once flag is present.', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener('foo', f, {
        once: true
      });
      assert.strictEqual(countEventListeners(target), 0);
    });

    it('should remove a given event listener even if the signal is present.', () => {
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener('foo', f, {
        signal: new AbortSignalStub()
      });
      assert.strictEqual(countEventListeners(target), 0);
    });

    it('should handle non-string types as string types.', () => {
      target.addEventListener('null', f);
      target.addEventListener('undefined', f);
      target.addEventListener('1000', f);
      assert.strictEqual(countEventListeners(target, 'null'), 1);
      assert.strictEqual(countEventListeners(target, 'undefined'), 1);
      assert.strictEqual(countEventListeners(target, '1000'), 1);

      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener(null, f);
      assert.strictEqual(countEventListeners(target, 'null'), 0);
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener(undefined, f);
      assert.strictEqual(countEventListeners(target, 'undefined'), 0);
      // @ts-expect-error -- the runtime accepts values the public types reject
      target.removeEventListener(1e3, f);
      assert.strictEqual(countEventListeners(target, '1000'), 0);
    });
  });

  describe('\'dispatchEvent\' method', () => {
    let target: EventTargetShim<{ foo: EventShim; }>;

    beforeEach(() => {
      target = new EventTargetShim();
    });

    it('should throw a TypeError if the argument was not present', () => {
      assert.throws(() => {
        // @ts-expect-error -- the runtime accepts values the public types reject
        target.dispatchEvent();
      }, TypeError);
    });

    it('should not throw even if listeners don\'t exist', () => {
      const retv = target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(retv, true);
    });

    it('should not throw even if empty object had been added', () => {
      const f = {};

      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener('foo', f);
      const retv = target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(retv, true);
      assertWarning(InvalidEventListener, f);
    });

    it('should call obj.handleEvent method even if added later', () => {
      const event = new EventShim('foo');
      const f: { handleEvent?: TSpy<(event: EventShim) => void>; } = {};

      // @ts-expect-error -- the runtime accepts values the public types reject
      target.addEventListener('foo', f);
      f.handleEvent = spy();
      const retv = target.dispatchEvent(event);

      assert.strictEqual(
          f.handleEvent.calls.length,
          1,
          'handleEvent should be called'
      );
      assert.strictEqual(f.handleEvent.calls[0].this, f);
      assert.strictEqual(f.handleEvent.calls[0].arguments[0], event);
      assert.strictEqual(retv, true);
      assertWarning(InvalidEventListener, f);
    });

    it('should call a registered listener.', () => {
      const f1 = spy((_event: EventShim) => {});
      const f2 = spy((_event: EventShim) => {});

      target.addEventListener('foo', f1);
      target.addEventListener('bar', f2);

      const event = new EventShim('foo');
      const retv = target.dispatchEvent(event);

      assert.strictEqual(f1.calls.length, 1, 'foo should be called once');
      assert.strictEqual(
          f1.calls[0].arguments.length,
          1,
          'the argument of callback should be one'
      );
      assert.strictEqual(
          f1.calls[0].arguments[0],
          event,
          'the argument of callback should be the given Event object'
      );
      assert.strictEqual(f2.calls.length, 0, 'bar should not be called');
      assert.strictEqual(retv, true);
    });

    it('should not call subsequent listeners if a listener called `event.stopImmediatePropagation()`.', () => {
      const f1 = spy((_event: EventShim) => {});
      const f2 = spy((event: EventShim) => {
        event.stopImmediatePropagation();
      });
      const f3 = spy((_event: EventShim) => {});
      const f4 = spy((_event: EventShim) => {});

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);
      target.addEventListener('foo', f4);

      const retv = target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called');
      assert.strictEqual(f3.calls.length, 0, 'f3 should not be called');
      assert.strictEqual(f4.calls.length, 0, 'f4 should not be called');
      assert.strictEqual(retv, true);
    });

    it('should return true even if a listener called \'event.preventDefault()\' if the event is not cancelable.', () => {
      target.addEventListener('foo', event => {
        event.preventDefault();
      });
      const retv = target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(retv, true);
      assertWarning(NonCancelableEventWasCanceled);
    });

    it('should return false if a listener called \'event.preventDefault()\' and the event is cancelable.', () => {
      target.addEventListener('foo', event => {
        event.preventDefault();
      });
      const retv = target.dispatchEvent(
          new EventShim('foo', {
            cancelable: true
          })
      );

      assert.strictEqual(retv, false);
    });

    it('should return true even if a listener called \'event.preventDefault()\' if passive option is present.', () => {
      target.addEventListener(
          'foo',
          event => {
            event.preventDefault();
          },
          {
            passive: true
          }
      );
      const retv = target.dispatchEvent(
          new EventShim('foo', {
            cancelable: true
          })
      );

      assert.strictEqual(retv, true);
      assertWarning(CanceledInPassiveListener);
    });

    it('should return true even if a listener called \'event.returnValue = false\' if the event is not cancelable.', () => {
      target.addEventListener('foo', event => {
        event.returnValue = false;
      });
      const retv = target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(retv, true);
      assertWarning(NonCancelableEventWasCanceled);
    });

    it('should return false if a listener called \'event.returnValue = false\' and the event is cancelable.', () => {
      target.addEventListener('foo', event => {
        event.returnValue = false;
      });
      const retv = target.dispatchEvent(
          new EventShim('foo', {
            cancelable: true
          })
      );

      assert.strictEqual(retv, false);
    });

    it('should return true even if a listener called \'event.returnValue = false\' if passive option is present.', () => {
      target.addEventListener(
          'foo',
          event => {
            event.returnValue = false;
          },
          {
            passive: true
          }
      );
      const retv = target.dispatchEvent(
          new EventShim('foo', {
            cancelable: true
          })
      );

      assert.strictEqual(retv, true);
      assertWarning(CanceledInPassiveListener);
    });

    it('should remove a listener if once option is present.', () => {
      const f1 = spy();
      const f2 = spy();
      const f3 = spy();

      target.addEventListener('foo', f1, {
        once: true
      });
      target.addEventListener('foo', f2, {
        once: true
      });
      target.addEventListener('foo', f3, {
        once: true
      });

      const retv = target.dispatchEvent(new EventShim('foo'));

      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called once');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called once');
      assert.strictEqual(f3.calls.length, 1, 'f3 should be called once');
      assert.strictEqual(countEventListeners(target), 0);
      assert.strictEqual(retv, true);
    });

    it('should handle removing in event listeners correctly. Remove 0 at 0.', () => {
      const f1 = spy(() => {
        target.removeEventListener('foo', f1);
      });
      const f2 = spy();
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called once');
      assert.strictEqual(f2.calls.length, 2, 'f2 should be called twice');
      assert.strictEqual(f3.calls.length, 2, 'f3 should be called twice');
    });

    it('should handle removing in event listeners correctly. Remove 1 at 0.', () => {
      const f2 = spy();
      const f1 = spy(() => {
        target.removeEventListener('foo', f2);
      });
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 0, 'f2 should not be called');
      assert.strictEqual(f3.calls.length, 2, 'f3 should be called twice');
    });

    it('should handle removing in event listeners correctly. Remove 0 at 1.', () => {
      const f1 = spy();
      const f2 = spy(() => {
        target.removeEventListener('foo', f1);
      });
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called once');
      assert.strictEqual(f2.calls.length, 2, 'f2 should be called twice');
      assert.strictEqual(f3.calls.length, 2, 'f3 should be called twice');
    });

    it('should handle removing in event listeners correctly. Remove 1 at 1.', () => {
      const f1 = spy();
      const f2 = spy(() => {
        target.removeEventListener('foo', f2);
      });
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called once');
      assert.strictEqual(f3.calls.length, 2, 'f3 should be called twice');
    });

    it('should handle removing in event listeners correctly. Remove 2 at 1.', () => {
      const f1 = spy();
      const f3 = spy();
      const f2 = spy(() => {
        target.removeEventListener('foo', f3);
      });

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 2, 'f2 should be called twice');
      assert.strictEqual(f3.calls.length, 0, 'f3 should be not called');
    });

    it('should handle removing in event listeners correctly. Remove 2 at 2.', () => {
      const f1 = spy();
      const f2 = spy();
      const f3 = spy(() => {
        target.removeEventListener('foo', f3);
      });

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 2, 'f2 should be called twice');
      assert.strictEqual(f3.calls.length, 1, 'f3 should be called once');
    });

    it('should handle removing in event listeners correctly along with once flag.', () => {
      const f1 = spy();
      const f2 = spy(() => {
        target.removeEventListener('foo', f2);
      });
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2, {
        once: true
      });
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called once');
      assert.strictEqual(f3.calls.length, 2, 'f3 should be called twice');
    });

    it('should handle removing in event listeners correctly along with once flag. (2)', () => {
      const f1 = spy();
      const f3 = spy();
      const f2 = spy(() => {
        target.removeEventListener('foo', f3);
      });
      const f4 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2, {
        once: true
      });
      target.addEventListener('foo', f3);
      target.addEventListener('foo', f4);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called once');
      assert.strictEqual(f3.calls.length, 0, 'f3 should not be called');
      assert.strictEqual(f4.calls.length, 2, 'f4 should be called twice');
    });

    it('should handle removing once and remove', () => {
      const f1 = spy(() => {
        target.removeEventListener('foo', f1);
      });

      target.addEventListener('foo', f1, {
        once: true
      });

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called once');
    });

    it('should handle removing once and signal', () => {
      const signal = new AbortSignalStub();
      const f1 = spy(() => {
        signal.abort();
      });

      target.addEventListener('foo', f1, {
        once: true,
        signal
      });

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called once');
    });

    it('should handle once in nested dispatches', () => {
      const f2 = spy();
      const f1 = spy(() => {
        target.dispatchEvent(new EventShim('foo'));
        assert.strictEqual(
            f2.calls.length,
            1,
            'f2 should be called only once'
        );
      });

      target.addEventListener('foo', f1, {
        once: true
      });
      target.addEventListener('foo', f2, {
        once: true
      });

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(
          f1.calls.length,
          1,
          'f1 should be called only once'
      );
      assert.strictEqual(
          f2.calls.length,
          1,
          'f2 should be called only once'
      );
    });

    it('should not call the listeners that were added after the \'dispatchEvent\' method call.', () => {
      const f1 = spy();
      const f3 = spy();
      const f2 = spy(() => {
        target.addEventListener('foo', f3);
      });

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 2, 'f2 should be called twice');
      assert.strictEqual(f3.calls.length, 1, 'f3 should be called once');

      // happens at the second dispatch.
      assertWarning(EventListenerWasDuplicated, 'bubble', f3);
    });

    it('should not call the listeners that were added after the \'dispatchEvent\' method call. (the last listener is removed at first dispatch)', () => {
      const f1 = spy();
      const f3 = spy();
      const f2 = spy(() => {
        target.addEventListener('foo', f3);
      });

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2, {
        once: true
      });

      target.dispatchEvent(new EventShim('foo'));
      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 2, 'f1 should be called twice');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called once');
      assert.strictEqual(f3.calls.length, 1, 'f3 should be called once');
    });

    it('should catch exceptions that are thrown from listeners and call the error handler.', () => {
      const error = new Error('test');
      const f1 = spy();
      const f2 = spy(() => {
        throw error;
      });
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called');
      assert.strictEqual(f3.calls.length, 1, 'f3 should be called');
      assertError(error);
    });

    it('should catch exceptions that are thrown from listeners and call the error handler, even if the exception was not an Error object.', () => {
      const error = 'error';
      const f1 = spy();
      const f2 = spy(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- this test covers non-Error thrown values
        throw error;
      });
      const f3 = spy();

      target.addEventListener('foo', f1);
      target.addEventListener('foo', f2);
      target.addEventListener('foo', f3);

      target.dispatchEvent(new EventShim('foo'));

      assert.strictEqual(f1.calls.length, 1, 'f1 should be called');
      assert.strictEqual(f2.calls.length, 1, 'f2 should be called');
      assert.strictEqual(f3.calls.length, 1, 'f3 should be called');
      assertError(error);
    });

    it('should throw a InvalidStateError if the given event is being used', () => {
      const event = new EventShim('foo');
      const f = spy(() => {
        target.dispatchEvent(event);
      });

      target.addEventListener('foo', f, {
        once: true
      });
      target.dispatchEvent(event);

      assert.strictEqual(f.calls.length, 1, 'f should be called');
      assert.strictEqual(f.calls[0].type, 'throw' as const);
      assert.strictEqual(f.calls[0].throw.name, 'InvalidStateError');
      assert.strictEqual(f.calls[0].throw.code, 11);
      assertError('This event has been in dispatching.');
    });

    const withNativeDomException = NativeDomException ? describe : describe.skip;

    withNativeDomException(
        'if the native DOMException is present, the InvalidStateError',
        () => {
          it('should be a DOMException instance.', () => {
            const event = new EventShim('foo');
            const f = spy(() => {
              target.dispatchEvent(event);
            });

            target.addEventListener('foo', f, {
              once: true
            });
            target.dispatchEvent(event);

            assert.strictEqual(f.calls.length, 1, 'f should be called');
            assert(f.calls[0].type === 'throw', 'f shold throw a value');
            assert(
                f.calls[0].throw instanceof NativeDomException,
                'the thrown value should be a DOMException'
            );
            assertError('This event has been in dispatching.');
          });
        }
    );

    it('should not call event listeners if given event was stopped', () => {
      const event = new EventShim('foo');
      const f = spy();

      event.stopPropagation();
      target.addEventListener('foo', f);
      target.dispatchEvent(event);

      assert.strictEqual(f.calls.length, 0, 'f should not be called');
    });

    const withNativeEvent = NativeEvent ? describe : describe.skip;

    withNativeEvent('if native Event class is present', () => {
      it('should call a registered listener even if the argument is a native Event object.', () => {
        const f1 = spy((_event: EventShim) => {});

        target.addEventListener('foo', f1);

        const retv = target.dispatchEvent(new NativeEvent('foo'));

        assert.strictEqual(
            f1.calls.length,
            1,
            'foo should be called once'
        );
        assert(
            f1.calls[0].arguments[0] instanceof EventShim,
            'the argument of callback should be an instance of our Event class (wrapper)'
        );
        assert.strictEqual(retv, true);
      });

      describe('if the argument is a native Event object, the event object in the listener', () => {
        it('\'type\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo');
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.type, event.type);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'target\' property should be the event target that is dispatching.', () => {
          const event = new NativeEvent('foo');
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.target, target);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'currentTarget\' property should be the event target that is dispatching.', () => {
          const event = new NativeEvent('foo');
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.currentTarget, target);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'eventPhase\' property should be 2.', () => {
          const event = new NativeEvent('foo');
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.eventPhase, 2);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'stopPropagation()\' method should change both \'cancelBubble\' property.', () => {
          const event = new NativeEvent('foo');
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            wrapper.stopPropagation();
            assert.strictEqual(wrapper.cancelBubble, true);
            assert.strictEqual(event.cancelBubble, true);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'cancelBubble\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo');

          event.stopPropagation();
          let ok = true;

          target.addEventListener('foo', _wrapper => {
            ok = false;
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        // Node.js's `Event` class is buggy.
        const isStopImmediatePropagationBuggy = (() => {
          if (!NativeEvent) {
            return false;
          }

          const e = new NativeEvent('foo');

          e.stopImmediatePropagation();

          return !e.cancelBubble;
        })()

                ;(isStopImmediatePropagationBuggy ? it.skip : it)(
            '\'stopImmediatePropagation()\' method should change both \'cancelBubble\' property.',
            () => {
              const event = new NativeEvent('foo');
              let ok = false;

              target.addEventListener('foo', wrapper => {
                ok = true;
                wrapper.stopImmediatePropagation();
                assert.strictEqual(
                    wrapper.cancelBubble,
                    true,
                    'wrapper\'s cancelBubble should be true'
                );
                assert.strictEqual(
                    event.cancelBubble,
                    true,
                    'original\'s cancelBubble should be true'
                );
              });
              target.dispatchEvent(event);
              assert(ok);
            }
        );

        it('\'bubbles\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo', {
            bubbles: true
          });
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.bubbles, event.bubbles);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'cancelable\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo', {
            cancelable: true
          });
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.cancelable, event.cancelable);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'returnValue\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo', {
            cancelable: true
          });

          event.preventDefault();
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(
                wrapper.returnValue,
                event.returnValue
            );
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'preventDefault()\' method should change both \'defaultPrevented\' property.', () => {
          const event = new NativeEvent('foo', {
            cancelable: true
          });
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            wrapper.preventDefault();
            assert.strictEqual(wrapper.defaultPrevented, true);
            assert.strictEqual(event.defaultPrevented, true);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'defaultPrevented\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo', {
            cancelable: true
          });

          event.preventDefault();
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(
                wrapper.defaultPrevented,
                event.defaultPrevented
            );
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'composed\' property should be the same value as the original.', () => {
          const event = new NativeEvent('foo', {
            composed: true
          });
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.composed, event.composed);
          });
          target.dispatchEvent(event);
          assert(ok);
        });

        it('\'timeStamp\' property should be the same value as the original.', async () => {
          const event = new NativeEvent('foo');

          await new Promise(resolve => {
            setTimeout(resolve, 100);
          });
          let ok = false;

          target.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.timeStamp, event.timeStamp);
          });
          target.dispatchEvent(event);
          assert(ok);
        });
      });
    });

    const withNativeKeyboardEvent = NativeKeyboardEvent ? describe : describe.skip;

    withNativeKeyboardEvent('if native KeyboardEvent class is present', () => {
      describe('if the argument is a native KeyboardEvent object, the event object in the listener', () => {
        it('\'key\' property should be the same value as the original.', () => {
          const customTarget = new EventTargetShim<{
            foo: KeyboardEvent;
          }>();
          const event = new NativeKeyboardEvent('foo', {
            key: 'Enter'
          });
          let ok = false;

          customTarget.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.key, event.key);
          });
          customTarget.dispatchEvent(event);
          assert(ok);
        });

        it('\'getModifierState\' method should return the same value as the original.', () => {
          const customTarget = new EventTargetShim<{
            foo: KeyboardEvent;
          }>();
          const event = new NativeKeyboardEvent('foo', {
            shiftKey: true
          });
          let ok = false;

          customTarget.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(
                wrapper.getModifierState('Shift'),
                event.getModifierState('Shift')
            );
          });
          customTarget.dispatchEvent(event);
          assert(ok);
        });
      });
    });

    const withNativeMouseEvent = NativeMouseEvent ? describe : describe.skip;

    withNativeMouseEvent('if native MouseEvent class is present', () => {
      describe('if the argument is a native MouseEvent object, the event object in the listener', () => {
        it('\'button\' property should be the same value as the original.', () => {
          const customTarget = new EventTargetShim<{ foo: MouseEvent; }>();
          const event = new NativeMouseEvent('foo', {
            button: 1
          });
          let ok = false;

          customTarget.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(wrapper.button, event.button);
          });
          customTarget.dispatchEvent(event);
          assert(ok);
        });

        it('\'getModifierState\' method should return the same value as the original.', () => {
          const customTarget = new EventTargetShim<{ foo: MouseEvent; }>();
          const event = new NativeMouseEvent('foo', {
            shiftKey: true
          });
          let ok = false;

          customTarget.addEventListener('foo', wrapper => {
            ok = true;
            assert.strictEqual(
                wrapper.getModifierState('Shift'),
                event.getModifierState('Shift')
            );
          });
          customTarget.dispatchEvent(event);
          assert(ok);
        });
      });
    });

    describe('if the argument is a plain object, the event object in the listener', () => {
      class MyEvent extends EventShim {
        writable: number;
        constructor(writable: number) {
          super('myevent');
          this.writable = writable;
        }
      }

      // eslint-disable-next-line no-shadow
      let target: EventTargetShim<{ foo: EventShim; bar: MyEvent; }, 'strict'>;

      beforeEach(() => {
        target = new EventTargetShim();
      });

      it('\'type\' property should be the same value as the original.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.type, event.type);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'target\' property should be the event target that is dispatching.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.target, target);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'currentTarget\' property should be the event target that is dispatching.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.currentTarget, target);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'eventPhase\' property should be 2.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.eventPhase, 2);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'stopPropagation()\' method should call the \'stopPropagation()\' method on the original.', () => {
        const event = {
          type: 'foo',
          stopPropagation: spy()
        } as const;

        target.addEventListener('foo', wrapper => {
          wrapper.stopPropagation();
        });
        target.dispatchEvent(event);
        assert.strictEqual(
            event.stopPropagation.calls.length,
            1,
            'stopPropagation method should be called'
        );
      });

      it('\'stopPropagation()\' method should not throw any error even if the original didn\'t have the \'stopPropagation()\' method.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = true;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.stopPropagation();
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'cancelBubble\' property should be the same value as the original.', () => {
        const event = {
          type: 'foo',
          cancelBubble: true
        } as const;
        let ok = true;

        target.addEventListener('foo', _wrapper => {
          ok = false;
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('assigning to \'cancelBubble\' property should change both the wrapper and the original.', () => {
        const event = {
          type: 'foo',
          cancelBubble: false
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.cancelBubble = true;
          assert.strictEqual(wrapper.cancelBubble, true);
          assert.strictEqual(event.cancelBubble, true);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('assigning to \'cancelBubble\' property should change only the wrapper if the original didn\'t have the property.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.cancelBubble = true;
          assert.strictEqual(wrapper.cancelBubble, true);
          // @ts-expect-error -- the runtime accepts values the public types reject
          assert.strictEqual(event.cancelBubble, undefined);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'stopImmediatePropagation()\' method should call the \'stopImmediatePropagation()\' method on the original.', () => {
        const event = {
          type: 'foo',
          stopImmediatePropagation: spy()
        } as const;

        target.addEventListener('foo', wrapper => {
          wrapper.stopImmediatePropagation();
        });
        target.dispatchEvent(event);
        assert.strictEqual(
            event.stopImmediatePropagation.calls.length,
            1,
            'stopImmediatePropagation method should be called'
        );
      });

      it('\'stopImmediatePropagation()\' method should not throw any error even if the original didn\'t have the \'stopImmediatePropagation()\' method.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = true;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.stopImmediatePropagation();
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'bubbles\' property should be the same value as the original.', () => {
        const event = {
          type: 'foo',
          bubbles: true
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.bubbles, event.bubbles);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'cancelable\' property should be the same value as the original.', () => {
        const event = {
          type: 'foo',
          cancelable: true
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.cancelable, event.cancelable);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'returnValue\' property should be the same value as the original.', () => {
        const event = {
          type: 'foo',
          returnValue: true
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.returnValue, event.returnValue);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('assigning to \'returnValue\' property should change both the wrapper and the original.', () => {
        const event = {
          type: 'foo',
          cancelable: true,
          returnValue: true
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.returnValue = false;
          assert.strictEqual(wrapper.returnValue, false);
          assert.strictEqual(event.returnValue, false);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('assigning to \'returnValue\' property should change only the wrapper if the original didn\'t have the property.', () => {
        const event = {
          type: 'foo',
          cancelable: true
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.returnValue = false;
          assert.strictEqual(wrapper.returnValue, false);
          // @ts-expect-error -- the runtime accepts values the public types reject
          assert.strictEqual(event.returnValue, undefined);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'preventDefault()\' method should call the \'preventDefault()\' method on the original.', () => {
        const event = {
          type: 'foo',
          cancelable: true,
          preventDefault: spy()
        } as const;

        target.addEventListener('foo', wrapper => {
          wrapper.preventDefault();
        });
        target.dispatchEvent(event);
        assert.strictEqual(
            event.preventDefault.calls.length,
            1,
            'preventDefault method should be called'
        );
      });

      it('\'preventDefault()\' method should not throw any error even if the original didn\'t have the \'preventDefault()\' method.', () => {
        const event = {
          type: 'foo',
          cancelable: true
        } as const;
        let ok = true;

        target.addEventListener('foo', wrapper => {
          ok = true;
          wrapper.preventDefault();
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'composed\' property should be the same value as the original.', () => {
        const event = {
          type: 'foo',
          composed: true
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.composed, event.composed);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'timeStamp\' property should be the same value as the original.', async () => {
        const event = {
          type: 'foo',
          timeStamp: Date.now()
        } as const;

        await new Promise(resolve => {
          setTimeout(resolve, 100);
        });
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(wrapper.timeStamp, event.timeStamp);
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('\'timeStamp\' property should be a number even if the original didn\'t have the \'timeStamp\' property.', () => {
        const event = {
          type: 'foo'
        } as const;
        let ok = false;

        target.addEventListener('foo', wrapper => {
          ok = true;
          assert.strictEqual(typeof wrapper.timeStamp, 'number');
        });
        target.dispatchEvent(event);
        assert(ok);
      });

      it('should redirect instance properties.', () => {
        const event = {
          type: 'bar',
          writable: 1
        } as const;

        target.addEventListener('bar', wrapper => {
          assert.strictEqual(wrapper.writable, 1);
          wrapper.writable = 2;
        });
        target.dispatchEvent(event);
        assert.strictEqual(event.writable, 2);
      });

      it('should not throw even if prototype is null.', () => {
        const event = Object.assign(
            Object.create(null) as object,
            {
              type: 'bar',
              writable: 1
            } as const
        );

        target.addEventListener('bar', wrapper => {
          assert.strictEqual(wrapper.writable, 1);
          wrapper.writable = 2;
        });
        target.dispatchEvent(event);
        assert.strictEqual(event.writable, 2);
      });
    });
  });

  describe('for-in', () => {
    it('should enumerate 3 property names', () => {
      const target = new EventTargetShim();
      const actualKeys = [];
      const expectedKeys = [
        'addEventListener',
        'removeEventListener',
        'dispatchEvent'
      ];

      for (const key in target) {
        actualKeys.push(key);
      }

      assert.deepStrictEqual(
          actualKeys.sort(undefined),
          expectedKeys.sort(undefined)
      );
    });

    it('should enumerate no property names in static', () => {
      const keys = new Set();

      for (const key in EventTargetShim) {
        keys.add(key);
      }

      assert.deepStrictEqual(keys, new Set());
    });
  });
});
