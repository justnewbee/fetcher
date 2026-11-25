import {
  IAbortSignalClassType,
  TEventListenerCallbackFunction
} from '../types';
import {
  getEventAttributeValue,
  setEventAttributeValue,
  mapOfAbortSignalInternalGet,
  mapOfAbortSignalInternalSet
} from '../util';

import {
  createDomException
} from './dom-exception-shim';
import EventShim from './event-shim';
import EventTargetShim from './event-target-shim';

let constructing = false; // Whether the current construction is initiated by `createAbortSignal`

/**
 * Create an AbortSignal object.
 */
export function createAbortSignal(): AbortSignalShim {
  constructing = true;
  
  try {
    // eslint-disable-next-line no-use-before-define
    const signal = new AbortSignalShim();
    
    mapOfAbortSignalInternalSet(signal, {
      aborted: false,
      reason: undefined
    });
    
    return signal;
  } finally {
    constructing = false;
  }
}

/**
 * Abort a given signal.
 */
export function abortSignal(signal: IAbortSignalClassType, reason?: unknown): void {
  const data = mapOfAbortSignalInternalGet(signal);
  
  if (data.aborted) {
    return;
  }
  
  data.aborted = true;
  data.reason = reason === undefined ? createDomException('This operation was aborted', 'AbortError') : reason;
  signal.dispatchEvent(new EventShim('abort'));
}

/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
export default class AbortSignalShim extends EventTargetShim<{ abort: EventShim; }> implements IAbortSignalClassType {
  /**
   * Return a new signal which has been already aborted with the given reason.
   *
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-abort
   */
  public static abort(reason?: unknown): AbortSignalShim {
    const signal = createAbortSignal();
    
    mapOfAbortSignalInternalSet(signal, {
      aborted: true,
      reason: reason === undefined ? createDomException('This operation was aborted', 'AbortError') : reason
    });
    
    return signal;
  }
  
  /**
   * Return a new signal which is aborted when any of the given signals is aborted.
   *
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-any
   */
  public static any(signals: readonly IAbortSignalClassType[]): AbortSignalShim {
    const signal = createAbortSignal();
    const listeners: { signal: IAbortSignalClassType; listener(): void; }[] = [];
    
    const abort = (source: IAbortSignalClassType): void => {
      for (const item of listeners) {
        item.signal.removeEventListener('abort', item.listener);
      }
      
      abortSignal(signal, source.reason);
    };
    
    for (const source of signals) {
      if (source.aborted) {
        abort(source);
        
        break;
      }
      
      const listener = (): void => {
        abort(source);
      };
      
      listeners.push({
        signal: source,
        listener
      });
      source.addEventListener('abort', listener);
    }
    
    return signal;
  }
  
  /**
   * Return a new signal which is aborted after the given milliseconds.
   *
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-timeout
   */
  public static timeout(milliseconds: number): AbortSignalShim {
    if (!Number.isFinite(milliseconds) || milliseconds < 0 || milliseconds > 2 ** 53 - 1) {
      throw new TypeError(`The provided value '${milliseconds}' is not a valid 'unsigned long long'.`);
    }
    
    const signal = createAbortSignal();
    
    setTimeout(() => {
      abortSignal(signal, createDomException('signal timed out', 'TimeoutError'));
    }, milliseconds);
    
    return signal;
  }
  
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
    return mapOfAbortSignalInternalGet(this).aborted;
  }
  
  /**
   * The abort reason.
   */
  public get reason(): unknown {
    return mapOfAbortSignalInternalGet(this).reason;
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
  
  /**
   * Throw the abort reason if this signal has been aborted.
   */
  public throwIfAborted(): void {
    const data = mapOfAbortSignalInternalGet(this);
    
    if (data.aborted) {
      throw data.reason;
    }
  }
}

// Properties should be enumerable.
Object.defineProperties(AbortSignalShim.prototype, {
  aborted: {
    enumerable: true
  },
  reason: {
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
