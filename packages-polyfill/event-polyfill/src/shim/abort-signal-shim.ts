import {
  TEventListenerCallbackFunction
} from '../types';
import {
  getEventAttributeValue,
  setEventAttributeValue
} from '../util';

import EventShim from './event-shim';
import EventTargetShim from './event-target-shim';

/**
 * Whether the current construction is initiated by `createAbortSignal`.
 */
let constructing = false;

/**
 * Aborted flags for each instance.
 */
const abortedFlags = new WeakMap<AbortSignalShim, boolean>();

/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
export default class AbortSignalShim extends EventTargetShim<{ abort: EventShim; }> {
  /**
   * AbortSignal cannot be constructed directly.
   */
  public constructor() {
    super();
    
    if (!constructing) {
      throw new TypeError('AbortSignal cannot be constructed directly');
    }
  }
  
  /**
   * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
   */
  public get aborted(): boolean {
    const aborted = abortedFlags.get(this);
    
    if (typeof aborted !== 'boolean') {
      throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${(this as unknown) === null ? 'null' : typeof this}`);
    }
    
    return aborted;
  }
  
  /**
   * The event handler for the `abort` event.
   */
  public get onabort(): TEventListenerCallbackFunction<AbortSignalShim, EventShim> | null {
    return getEventAttributeValue<AbortSignalShim, EventShim>(this, 'abort');
  }
  
  public set onabort(value: TEventListenerCallbackFunction<AbortSignalShim, EventShim> | null) {
    setEventAttributeValue(this, 'abort', value);
  }
}

/**
 * Create an AbortSignal object.
 */
export function createAbortSignal(): AbortSignalShim {
  constructing = true;
  
  try {
    const signal = new AbortSignalShim();
    
    abortedFlags.set(signal, false);
    
    return signal;
  } finally {
    constructing = false;
  }
}

/**
 * Abort a given signal.
 */
export function abortSignal(signal: AbortSignalShim): void {
  if (abortedFlags.get(signal) !== false) {
    return;
  }
  
  abortedFlags.set(signal, true);
  signal.dispatchEvent(new EventShim('abort'));
}

// Properties should be enumerable.
Object.defineProperties(AbortSignalShim.prototype, {
  aborted: {
    enumerable: true
  },
  onabort: {
    enumerable: true
  }
});

// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol') {
  Object.defineProperty(AbortSignalShim.prototype, Symbol.toStringTag, {
    configurable: true,
    value: 'AbortSignal'
  });
}
