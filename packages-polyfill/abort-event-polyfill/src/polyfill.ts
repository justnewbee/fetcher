import DOMExceptionShim from './shim/dom-exception-shim';
import EventShim from './shim/event-shim';
import EventTargetShim from './shim/event-target-shim';
import AbortSignalShim from './shim/abort-signal-shim';
import AbortControllerShim from './shim/abort-controller-shim';

export default function polyfill(): void {
  if (typeof DOMException === 'undefined') {
    globalThis.DOMException = DOMExceptionShim;
  }
  
  if (typeof Event === 'undefined') {
    globalThis.Event = EventShim;
  }
  
  if (typeof EventTarget === 'undefined') {
    globalThis.EventTarget = EventTargetShim;
  }
  
  if (typeof AbortSignal === 'undefined') {
    globalThis.AbortSignal = AbortSignalShim;
  }
  
  if (typeof AbortController === 'undefined') {
    globalThis.AbortController = AbortControllerShim;
  }
}
