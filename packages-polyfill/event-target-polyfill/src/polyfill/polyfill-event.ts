import EventShim from '../shim/event-shim';

export default function polyfillEvent(): void {
  if (typeof Event === 'undefined') {
    globalThis.Event = EventShim;
  }
}
