import MockEventSource from './mock-event-source';

export default function defineGlobalEventSource(instances?: MockEventSource[]): void {
  Object.defineProperty(globalThis, 'EventSource', {
    value: class extends MockEventSource {
      constructor(url: string, options?: EventSourceInit) {
        super(url, options);
        instances?.push(this);
      }
    },
    writable: true,
    configurable: true
  });
}
