/* eslint-disable @typescript-eslint/no-empty-function -- empty callbacks are used as event listeners. */
/* eslint-disable no-console -- this suite replaces console.error to check the default error handler. */

import assert from 'assert';

import {
  afterEach,
  beforeEach,
  describe,
  test
} from 'vitest';

import {
  Event as EventShim,
  EventTarget as EventTargetShim,
  setWarningHandler
} from '../src';

import spy from './lib/spy';

describe('The default error handler', () => {
  const onBrowser = typeof window !== 'undefined' && typeof window.dispatchEvent === 'function';
  const onNode = !onBrowser && typeof process !== 'undefined' && typeof process.emit === 'function';

  beforeEach(() => {
    setWarningHandler(() => {});
  });
  afterEach(() => {
    setWarningHandler(undefined);
  });
  
  (onBrowser ? describe : describe.skip)('on a browser', () => {
    test('should dispatch an ErrorEvent if a listener threw an error', () => {
      const originalConsoleError = console.error;
      const f = spy((_message, _source, _lineno, _colno, _error) => {});
      const consoleError = spy((..._args: unknown[]) => {});
      const target = new EventTargetShim();
      const error = new Error('test error');

      target.addEventListener('foo', () => {
        throw error;
      });

      window.onerror = f;
      console.error = consoleError;

      try {
        target.dispatchEvent(new EventShim('foo'));
      } finally {
        window.onerror = null;
        console.error = originalConsoleError;
      }

      assert.strictEqual(f.calls.length, 1, 'f should be called.');
      assert.strictEqual(f.calls[0]?.arguments[0], error.message);
      assert.strictEqual(f.calls[0].arguments[4], error);
      assert.strictEqual(consoleError.calls.length, 1, 'console.error should be called.');
      assert.strictEqual(consoleError.calls[0]?.arguments[0], error);
    });
  });
  
  (onNode ? describe : describe.skip)('on Node.js', () => {
    let uncaughtExceptionListeners: ((..._args: unknown[]) => void)[];

    // Detach the test runner's `uncaughtException` handlers while this test
    // case because it expects `uncaughtException` to be emitted.
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      uncaughtExceptionListeners = process.listeners('uncaughtException');
      process.removeAllListeners('uncaughtException');
    });
    afterEach(() => {
      for (const listener of uncaughtExceptionListeners) {
        process.on('uncaughtException', listener);
      }
    });

    test('should emit an uncaughtException event if a listener threw an error', () => {
      const f = spy(_event => {});
      const target = new EventTargetShim();
      const error = new Error('test error');

      target.addEventListener('foo', () => {
        throw error;
      });

      process.on('uncaughtException', f);
      target.dispatchEvent(new EventShim('foo'));
      process.removeListener('uncaughtException', f);

      assert.strictEqual(f.calls.length, 1, 'f should be called.');
      assert.strictEqual(f.calls[0]?.arguments[0], error);
    });
  });
});
