import EventTargetShim from '../shim/event-target-shim';

export default function polyfillEventTarget(): void {
  if (typeof EventTarget === 'undefined') {
    globalThis.EventTarget = EventTargetShim;
  }
}
