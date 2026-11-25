import DOMExceptionShim from './shim/dom-exception-shim';
import EventShim from './shim/event-shim';
import EventTargetShim from './shim/event-target-shim';

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
}
