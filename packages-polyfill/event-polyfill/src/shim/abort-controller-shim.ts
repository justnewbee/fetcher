import AbortSignalShim, {
  abortSignal,
  createAbortSignal
} from './abort-signal-shim';

/**
 * Associated signals.
 */
const signals = new WeakMap<AbortControllerShim, AbortSignalShim>();

/**
 * Get the associated signal of a given controller.
 */
function getSignal(controller: AbortControllerShim): AbortSignalShim {
  const signal = signals.get(controller);
  
  if (signal === undefined) {
    const value: unknown = controller;
    
    throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${value === null ? 'null' : typeof value}`);
  }
  
  return signal;
}

/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */
export default class AbortControllerShim {
  /**
   * Initialize this controller.
   */
  public constructor() {
    signals.set(this, createAbortSignal());
  }
  
  /**
   * Returns the `AbortSignal` object associated with this object.
   */
  public get signal(): AbortSignalShim {
    return getSignal(this);
  }
  
  /**
   * Abort and signal to any observers that the associated activity is to be aborted.
   */
  public abort(): void {
    abortSignal(getSignal(this));
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
