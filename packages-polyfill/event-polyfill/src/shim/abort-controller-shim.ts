import {
  IAbortControllerClassType,
  IAbortSignalClassType
} from '../types';
import {
  mapOfAbortControllerSignalGet,
  mapOfAbortControllerSignalSet
} from '../util';

import {
  abortSignal,
  createAbortSignal
} from './abort-signal-shim';

/**
 * The AbortController.
 *
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */
export default class AbortControllerShim implements IAbortControllerClassType {
  /**
   * Initialize this controller.
   */
  public constructor() {
    mapOfAbortControllerSignalSet(this, createAbortSignal());
  }
  
  /**
   * Returns the `AbortSignal` object associated with this object.
   */
  public get signal(): IAbortSignalClassType {
    return mapOfAbortControllerSignalGet(this);
  }
  
  /**
   * Abort and signal to any observers that the associated activity is to be aborted.
   */
  public abort(reason?: unknown): void {
    abortSignal(mapOfAbortControllerSignalGet(this), reason);
  }
}

// Properties should be enumerable.
Object.defineProperties(AbortControllerShim.prototype, {
  signal: {
    enumerable: true
  },
  abort: {
    enumerable: true
  }
});

if (typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol') {
  Object.defineProperty(AbortControllerShim.prototype, Symbol.toStringTag, {
    configurable: true,
    value: 'AbortController'
  });
}
