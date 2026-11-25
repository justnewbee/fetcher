import {
  IEventClassType,
  IEventTargetClassType
} from './claz';

/**
 * The options of the `Event` constructor.
 * @see https://dom.spec.whatwg.org/#dictdef-eventinit
 */
export interface IEventInit {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

/**
 * The event-like object that can be wrapped.
 */
export type TEventLike = {
  readonly type: string;
} & Partial<IEventClassType>;

export interface IEventInternal {
  /**
   * The value of `type` attribute.
   */
  readonly type: string;
  /**
   * The value of `bubbles` attribute.
   */
  readonly bubbles: boolean;
  /**
   * The value of `cancelable` attribute.
   */
  readonly cancelable: boolean;
  /**
   * The value of `composed` attribute.
   */
  readonly composed: boolean;
  /**
   * The value of `timeStamp` attribute.
   */
  readonly timeStamp: number;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-target
   */
  target: IEventTargetClassType | null;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-currenttarget
   */
  currentTarget: IEventTargetClassType | null;
  /**
   * @see https://dom.spec.whatwg.org/#stop-propagation-flag
   */
  stopPropagationFlag: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#stop-immediate-propagation-flag
   */
  stopImmediatePropagationFlag: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#canceled-flag
   */
  canceledFlag: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#in-passive-listener-flag
   */
  inPassiveListenerFlag: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#dispatch-flag
   */
  dispatchFlag: boolean;
}
