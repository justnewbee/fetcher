/* eslint-disable @typescript-eslint/no-empty-function -- empty callbacks are used as event listeners. */

import assert from 'assert';

import {
  describe,
  it
} from 'vitest';

import EventTargetShim from '../src/index';
import {
  InvalidEventListener
} from '../src/util';

import {
  spy
} from './lib/spy';

describe('The default warning handler', () => {
  it('should print the warning by \'console.warn\'.', () => {
    /* eslint-disable no-console */
    const originalWarn = console.warn;
    const f = spy((..._args: unknown[]) => {});
    const target = new EventTargetShim();

    console.warn = f;
    target.addEventListener('foo');
    console.warn = originalWarn;

    assert.strictEqual(f.calls.length, 1, 'f should be called.');
    assert.strictEqual(
        f.calls[0].arguments[0],
        InvalidEventListener.message
    );
    assert.strictEqual(f.calls[0].arguments[1], undefined);
    /* eslint-enable no-console */
  });
});
