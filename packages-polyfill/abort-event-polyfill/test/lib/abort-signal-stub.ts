import {
  CallbackFunction,
  Event,
  EventTarget
} from '../../src';
import {
  getEventAttributeValue,
  setEventAttributeValue
} from '../../src/util';

/**
 * Stub for AbortSignal.
 */
export default class AbortSignalStub extends EventTarget<{
  abort: Event;
}> {
  public aborted = false;
  
  public reason: unknown = undefined;
  
  public get onabort(): CallbackFunction<EventTarget, Event> | null {
    return getEventAttributeValue<EventTarget, Event>(this, 'abort');
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
