import {
  AbortSignal,
  CallbackFunction,
  Event,
  EventTarget,
  getEventAttributeValue,
  setEventAttributeValue
} from '../../src';

/**
 * Stub for AbortSignal.
 */
export default class AbortSignalStub extends EventTarget<{
  abort: Event;
}> {
  public aborted = false;
  
  public reason: unknown = undefined;
  
  public get onabort(): CallbackFunction<AbortSignal, Event> | null {
    return getEventAttributeValue<AbortSignal, Event>(this, 'abort');
  }
  
  public set onabort(value) {
    setEventAttributeValue(this, 'abort', value);
  }
  
  public abort(): void {
    this.aborted = true;
    this.dispatchEvent(new Event('abort'));
  }
  
  public throwIfAborted(): void {
    if (this.aborted) {
      throw this.reason;
    }
  }
}
