import assert from 'assert';

import {
  describe,
  test
} from 'vitest';

import {
  EventTarget
} from '../src/index';
import {
  InvalidEventListener
} from '../src/util';

import spy from './lib/spy';

describe('The default warning handler', () => {
  test('should print the warning by \'console.warn\'.', () => {
    /* eslint-disable no-console */
    const originalWarn = console.warn;
    const f = spy((..._args: unknown[]) => {
      // do nothing
    });
    const target = new EventTarget();

    console.warn = f;
    target.addEventListener('foo');
    console.warn = originalWarn;

    assert.strictEqual(f.calls.length, 1, 'f should be called.');
    assert.strictEqual(f.calls[0]?.arguments[0], InvalidEventListener.message);
    assert.strictEqual(f.calls[0].arguments[1], undefined);
  });
});
