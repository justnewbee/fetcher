export default class MockEventSource extends EventTarget {
  url: string;
  withCredentials: boolean;
  readyState = 0;
  CLOSED = 2;
  CONNECTING = 0;
  OPEN = 1;
  
  constructor(url: string, options?: EventSourceInit) {
    super();
    this.url = url;
    this.withCredentials = options?.withCredentials ?? false;
  }
  
  close(): void {
    this.readyState = this.CLOSED;
  }
  
  emit(type: string, event: Event | MessageEvent): void {
    this.dispatchEvent(event);
  }
}
